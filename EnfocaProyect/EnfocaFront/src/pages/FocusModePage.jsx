import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SessionEndModal from '../components/timer/SessionEndModal';
import { planService } from '../services/api';

const STREAM_URL  = 'https://stream.zeno.fm/f3wvbbqmdg8uv';

function fmt(secs) {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return { m, s };
}

const IconPlay = () => ( <svg className="w-6 h-6 fill-current ml-0.5" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg> );
const IconPause = () => ( <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg> );
const IconClose = () => ( <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg> );
const IconVolume = ({ muted }) => muted ? (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M11 5L6 9H2v6h4l5 4V5z" /><line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" /></svg>
) : (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14" /><path d="M15.54 8.46a5 5 0 0 1 0 7.07" /></svg>
);

export default function FocusModePage() {
    const location = useLocation();
    const navigate = useNavigate();

    const state = location.state || {};
    const topic = state.topic || null;
    const [plan, setPlan] = useState(state.plan ?? null);
    const [panelVisible, setPanelVisible] = useState(true);
    const focusDuration      = state.focusDuration || 25 * 60;
    const shortBreakDuration = state.shortBreakDuration || 5 * 60;
    const longBreakFreq      = state.longBreakFreq || 4;
    const longBreakDuration  = state.longBreakDuration || 15 * 60;
    const totalRounds        = state.totalRounds || 4;

    // Si viene del Pomodoro con timer activo, retomar desde donde iba
    const resuming = state.currentPhase === 'RUNNING' || state.currentPhase === 'PAUSED' || state.currentPhase === 'BREAK';

    const [mode, setMode] = useState(state.currentPhase === 'BREAK' ? 'shortBreak' : 'focus');
    const [sesionesCompletadas, setSesionesCompletadas] = useState(
        state.currentRoundsLeft != null
            ? (state.totalRounds || 4) - state.currentRoundsLeft
            : (state.sesionesCompletadas || 0)
    );
    const [phase, setPhase]   = useState(resuming ? (state.currentPhase === 'RUNNING' ? 'RUNNING' : 'PAUSED') : 'PREPARING');
    const [prepLeft, setPrepLeft] = useState(10);
    const [timeLeft, setTimeLeft] = useState(state.currentTimeLeft ?? focusDuration);

    const [volume, setVolume] = useState(0.7);
    const audioRef = useRef(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const toggleTopic = async (temaId) => {
        if (!plan) return;
        let modIdx = -1, temaIdx = -1;
        plan.modulos.forEach((m, mi) => m.temas.forEach((t, ti) => {
            if (t.id === temaId) { modIdx = mi; temaIdx = ti; }
        }));
        if (modIdx === -1) return;

        const estaCompletado = plan.modulos[modIdx].temas[temaIdx].completado;

        if (estaCompletado) {
            const idsADesmarcar = [];
            plan.modulos.forEach((m, mi) => m.temas.forEach((t, ti) => {
                if (t.completado && ((mi === modIdx && ti >= temaIdx) || mi > modIdx))
                    idsADesmarcar.push(t.id);
            }));
            setPlan(prev => ({
                ...prev,
                modulos: prev.modulos.map((m, mi) => ({
                    ...m,
                    temas: m.temas.map((t, ti) => {
                        const esDespues = (mi === modIdx && ti >= temaIdx) || mi > modIdx;
                        return esDespues ? { ...t, completado: false } : t;
                    })
                }))
            }));
            idsADesmarcar.forEach(id => planService.toggleTema(id).catch(() => {}));
        } else {
            setPlan(prev => ({
                ...prev,
                modulos: prev.modulos.map((m, mi) => ({
                    ...m,
                    temas: m.temas.map((t, ti) =>
                        mi === modIdx && ti === temaIdx ? { ...t, completado: true } : t
                    )
                }))
            }));
            planService.toggleTema(temaId).catch(() => {});
            planService.registrarSesion(temaId).catch(() => {});
        }
    };

    useEffect(() => {
        if (audioRef.current) audioRef.current.volume = volume;
    }, [volume]);

    useEffect(() => {
        const el = document.documentElement;
        if (el.requestFullscreen) el.requestFullscreen().catch(() => {});
        return () => { if (document.fullscreenElement) document.exitFullscreen().catch(() => {}); };
    }, []);

    useEffect(() => {
        if (phase !== 'PREPARING') return;
        const id = setInterval(() => {
            setPrepLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(id);
                    setPhase('RUNNING');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(id);
    }, [phase]);

    useEffect(() => {
        if (phase !== 'RUNNING') return;
        if (mode === 'focus') audioRef.current?.play().catch(() => {});

        const id = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => { clearInterval(id); audioRef.current?.pause(); };
    }, [phase, mode]);

    // ── LÓGICA DE TRANSICIONES Y FIN DE SESIÓN ──
    useEffect(() => {
        if (phase === 'RUNNING' && timeLeft <= 0) {
            if (mode === 'focus') {
                const nextSesiones = sesionesCompletadas + 1;
                setSesionesCompletadas(nextSesiones);
                if (nextSesiones >= totalRounds) {
                    setPhase('IDLE');
                    triggerEndSession(); // Abrir modal al terminar rondas
                } else {
                    const isLongBreak = nextSesiones % longBreakFreq === 0;
                    setMode(isLongBreak ? 'longBreak' : 'shortBreak');
                    setTimeLeft(isLongBreak ? longBreakDuration : shortBreakDuration);
                    setPhase('RUNNING');
                }
            } else {
                setMode('focus');
                setTimeLeft(focusDuration);
                setPrepLeft(10);
                setPhase('PREPARING');
            }
        }
    }, [timeLeft, phase, mode, sesionesCompletadas, totalRounds, longBreakFreq, longBreakDuration, shortBreakDuration, focusDuration]);

    const handlePlayPause = () => {
        if (phase === 'RUNNING') setPhase('PAUSED');
        else if (phase === 'PAUSED') setPhase('RUNNING');
    };

    const triggerEndSession = () => {
        audioRef.current?.pause();
        setPhase('PAUSED');
        setIsModalOpen(true); // Abrir modal forzosamente
    };

    const handleClose = () => {
        audioRef.current?.pause();
        setPhase('PAUSED');
        setIsModalOpen(true); // Abrir el modal siempre

        // Navegar al dashboard después de cerrar el modal
        if (!topic) {
            setTimeout(() => {
                if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
                navigate('/dashboard');
            }, 300); // Ajusta el tiempo según la animación del modal
        }
    };

    const toggleMute = () => {
        if (volume > 0) lastVolume.current = volume;
        setVolume(volume > 0 ? 0 : lastVolume.current);
    };

    const totalDuration = mode === 'focus' ? focusDuration : (mode === 'shortBreak' ? shortBreakDuration : longBreakDuration);
    const elapsed  = totalDuration - timeLeft;
    const progress = phase === 'IDLE' ? 100 : (elapsed / totalDuration) * 100;
    const { m, s } = fmt(timeLeft);

    const getStatusText = () => {
        if (phase === 'IDLE') return 'Sesión Completada';
        if (phase === 'PREPARING') return 'Preparando...';
        if (phase === 'PAUSED') return 'Pausado';
        if (mode === 'focus') return 'Focus Period';
        if (mode === 'shortBreak') return 'Descanso Corto';
        return 'Descanso Largo';
    };


    return (
        <div className="h-screen w-screen bg-black text-white flex flex-col overflow-hidden select-none">
            <audio ref={audioRef} src={STREAM_URL} loop />

            <div className="absolute inset-0 z-0 transition-opacity duration-1000">
                <img src="/focus-bg.webp" alt="" className={`w-full h-full object-cover mix-blend-luminosity grayscale ${mode === 'focus' ? 'opacity-20' : 'opacity-10'}`} />
                <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
            </div>

            <div className="relative z-10 flex-shrink-0 px-8 py-4 flex justify-between items-center">
                <div className="flex items-center gap-5">
                    <span className="uppercase tracking-[0.3em] text-[10px] font-bold text-neutral-400">ENFOCA</span>
                    <div className="flex items-center gap-3">
                        <div className={`flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-widest transition-colors ${phase === 'RUNNING' && mode === 'focus' ? 'text-violet-400' : 'text-neutral-600'}`}>
                            <span>LOFI RADIO</span>
                            {phase === 'RUNNING' && mode === 'focus' && volume > 0 && (
                                <span className="flex gap-px ml-0.5">
                                    {[1, 2, 3].map(i => <span key={i} className="w-px bg-violet-400 rounded-full animate-pulse" style={{ height: `${6 + i * 3}px`, animationDelay: `${i * 0.15}s` }} />)}
                                </span>
                            )}
                        </div>
                        <button onClick={toggleMute} className="text-neutral-600 hover:text-violet-400 transition-colors"><IconVolume muted={volume === 0} /></button>
                        <input type="range" min="0" max="1" step="0.05" value={volume} onChange={e => setVolume(parseFloat(e.target.value))} className="w-20 accent-violet-500 cursor-pointer h-px bg-white/10 rounded-full" />
                    </div>
                </div>

                <button onClick={handleClose} className="flex items-center gap-2 text-neutral-500 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/5">
                    <span className="text-[10px] tracking-widest font-mono uppercase hidden sm:block">Finalizar</span>
                    <IconClose />
                </button>
            </div>

            <div className="relative z-10 flex-1 flex flex-row min-h-0">

                {/* Panel lateral del plan de estudio */}
                {plan && (
                    <div className={`flex-shrink-0 flex flex-col transition-all duration-300 ${panelVisible ? 'w-64' : 'w-10'} bg-black/40 border-r border-white/5 backdrop-blur-sm overflow-hidden`}>
                        {panelVisible ? (
                            <div className="flex flex-col h-full">
                                <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-white/5">
                                    <div className="min-w-0">
                                        <p className="text-[9px] font-mono text-neutral-600 uppercase tracking-widest mb-0.5">Plan activo</p>
                                        <p className="text-xs font-bold text-white truncate">{plan.titulo}</p>
                                    </div>
                                    <button onClick={() => setPanelVisible(false)} className="flex-shrink-0 ml-2 text-neutral-600 hover:text-white transition-colors">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
                                    </button>
                                </div>
                                <div className="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-3">
                                    {plan.modulos?.map((modulo, modIndex) => {
                                        const done  = modulo.temas?.filter(t => t.completado).length ?? 0;
                                        const total = modulo.temas?.length ?? 0;
                                        const moduleUnlocked = plan.modulos
                                            .slice(0, modIndex)
                                            .every(m => m.temas?.every(t => t.completado));
                                        return (
                                            <div key={modulo.id}>
                                                <div className="flex items-center justify-between mb-1.5">
                                                    <p className="text-[9px] font-mono text-neutral-500 uppercase tracking-wider truncate">{modulo.titulo}</p>
                                                    <span className="text-[9px] font-mono text-neutral-700 flex-shrink-0 ml-1">{done}/{total}</span>
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    {modulo.temas?.map((tema, temaIndex) => {
                                                        const prevAllDone = moduleUnlocked && modulo.temas.slice(0, temaIndex).every(t => t.completado);
                                                        const nextAnyDone = modulo.temas.slice(temaIndex + 1).some(t => t.completado);
                                                        const canToggle = moduleUnlocked && (tema.completado ? !nextAnyDone : prevAllDone);
                                                        return (
                                                            <button
                                                                key={tema.id}
                                                                onClick={() => canToggle && toggleTopic(tema.id)}
                                                                disabled={!canToggle}
                                                                title={tema.completado
                                                                    ? (!canToggle ? 'Desmarca los temas siguientes primero' : 'Desmarcar')
                                                                    : (!canToggle ? 'Completa los anteriores primero' : 'Marcar como completado')}
                                                                className={`flex items-center gap-2 px-2 py-1.5 rounded-lg transition-colors text-left w-full ${
                                                                    tema.completado ? 'bg-violet-600/10' : canToggle ? 'hover:bg-white/5 cursor-pointer' : 'cursor-not-allowed opacity-40'
                                                                }`}
                                                            >
                                                                <div className={`w-3 h-3 rounded flex-shrink-0 border flex items-center justify-center transition-all ${
                                                                    tema.completado ? 'bg-violet-500 border-violet-500' : canToggle ? 'border-neutral-500' : 'border-neutral-700'
                                                                }`}>
                                                                    {tema.completado && (
                                                                        <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" className="w-3 h-3">
                                                                            <polyline points="20 6 9 17 4 12"/>
                                                                        </svg>
                                                                    )}
                                                                </div>
                                                                <span className={`text-[10px] leading-tight ${tema.completado ? 'text-neutral-500 line-through' : 'text-neutral-300'}`}>
                                                                    {tema.titulo}
                                                                </span>
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ) : (
                            <button onClick={() => setPanelVisible(true)} className="h-full flex items-center justify-center text-neutral-600 hover:text-white transition-colors">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
                            </button>
                        )}
                    </div>
                )}

                {/* Timer centrado */}
                <div className="flex-1 flex flex-col items-center justify-center min-h-0">

                {/* ── INDICADOR DINÁMICO DE RONDAS TOTALES ── */}
                <div className="flex gap-3 mb-8">
                    {Array.from({ length: totalRounds }, (_, i) => i + 1).map(dot => {
                        const isCompleted = sesionesCompletadas >= dot;
                        // El punto palpita si es la ronda en curso
                        const isCurrent = sesionesCompletadas + 1 === dot && phase !== 'IDLE';

                        return (
                            <div
                                key={dot}
                                className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${
                                    isCompleted ? 'bg-violet-500 shadow-[0_0_8px_rgba(139,92,246,0.6)]' :
                                        isCurrent ? 'bg-violet-500/50 animate-pulse' :
                                            'bg-neutral-800'
                                }`}
                            />
                        );
                    })}
                </div>

                <h2 className={`text-[10px] uppercase tracking-[0.4em] font-medium mb-4 ${phase === 'IDLE' ? 'text-violet-400' : (mode === 'focus' ? 'text-neutral-500' : 'text-emerald-500')}`}>
                    {getStatusText()}
                </h2>

                {phase === 'PREPARING' ? (
                    <div className="font-light leading-none tracking-tighter tabular-nums text-violet-400 animate-pulse mb-8" style={{ fontSize: 'clamp(80px, min(20vw, 28vh), 200px)' }}>
                        {prepLeft}
                    </div>
                ) : (
                    <div className={`font-light leading-none tracking-tighter tabular-nums transition-colors mb-8 ${phase === 'PAUSED' || phase === 'IDLE' ? 'text-neutral-500' : (mode === 'focus' ? 'text-white' : 'text-emerald-400')}`} style={{ fontSize: 'clamp(72px, min(18vw, 26vh), 180px)' }}>
                        {m}:{s}
                    </div>
                )}

                {(phase === 'RUNNING' || phase === 'PAUSED') && (
                    <button onClick={handlePlayPause} className={`w-14 h-14 rounded-full border flex items-center justify-center transition-all backdrop-blur-sm ${mode === 'focus' ? 'border-neutral-700/50 text-neutral-300 hover:text-white hover:bg-white/10' : 'border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/10'}`}>
                        {phase === 'RUNNING' ? <IconPause /> : <IconPlay />}
                    </button>
                )}

                {/* Cuando termina la sesión, muestra el botón para salir */}
                {phase === 'IDLE' && (
                    <button onClick={handleClose} className="px-10 py-3 rounded-full border border-violet-500/50 bg-violet-500/10 text-sm text-violet-300 hover:text-white hover:bg-violet-500/30 transition-all tracking-[0.2em] uppercase mt-4">
                        Terminar y Guardar
                    </button>
                )}

                {topic && <p className="mt-8 text-xs font-mono text-neutral-500 tracking-widest uppercase">{topic.titulo}</p>}

                {/* Barra de progreso — dentro del timer para mantener el centrado */}
                {phase !== 'PREPARING' && (
                    <div className="w-full max-w-sm px-4 pb-6 mt-8">
                        <div className="h-px w-full bg-neutral-800 rounded-full mb-3 overflow-hidden">
                            <div className={`h-full rounded-full transition-all duration-1000 ${phase === 'IDLE' ? 'bg-violet-500' : (mode === 'focus' ? 'bg-violet-500' : 'bg-emerald-500')}`} style={{ width: `${progress}%` }} />
                        </div>
                        <div className="flex justify-between text-[9px] font-mono text-neutral-600 uppercase tracking-widest">
                            <span>{fmt(elapsed).m}m {fmt(elapsed).s}s transcurrido</span>
                            <span>{m}m {s}s restante</span>
                        </div>
                    </div>
                )}
                </div>{/* fin timer centrado */}
            </div>{/* fin flex-row */}

            <SessionEndModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                topic={topic}
                onComplete={() => {
                    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
                    navigate('/dashboard');
                }}
                onSchedule={() => {
                    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
                    navigate('/dashboard');
                }}
            />

            </div>
    );
}
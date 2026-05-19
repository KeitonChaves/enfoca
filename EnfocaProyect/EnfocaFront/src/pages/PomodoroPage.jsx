import React, { useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import MainTimerCard from '../components/timer/MainTimerCard';
import { planService } from '../services/api';
import { Maximize2 } from 'lucide-react';

const IconChevron = ({ open }) => (
    <svg className={`w-3 h-3 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <polyline points="9 18 15 12 9 6" />
    </svg>
);

function ModuleItem({ modulo, onToggle }) {
    const [expanded, setExpanded] = useState(false);
    const completed = modulo.temas?.filter(t => t.completado).length ?? 0;
    const total     = modulo.temas?.length ?? 0;
    const allDone   = total > 0 && completed === total;

    return (
        <div className="border-b border-neutral-800/60 last:border-0">
            <button onClick={() => setExpanded(v => !v)} className="w-full flex items-center gap-2 py-2 px-1 hover:bg-neutral-800/40 transition-colors text-left group rounded-lg">
                <IconChevron open={expanded} />
                <div className="flex-1 min-w-0">
                    <p className={`text-[11px] font-bold tracking-widest uppercase mb-0.5 ${allDone ? 'text-violet-500/50' : 'text-neutral-600'}`}>M{String(modulo.orden).padStart(2, '0')}</p>
                    <p className={`text-sm truncate leading-tight transition-colors ${allDone ? 'text-neutral-600 line-through' : 'text-neutral-300 group-hover:text-white'}`}>{modulo.titulo}</p>
                </div>
                <span className="text-xs text-neutral-600 font-mono flex-shrink-0 ml-1">{completed}/{total}</span>
            </button>
            {expanded && (
                <div className="pl-5 pb-1.5 flex flex-col gap-0.5 border-l border-neutral-800 ml-1.5 mt-0.5">
                    {modulo.temas?.map(tema => (
                        <button key={tema.id} onClick={() => onToggle(tema.id)} className="flex items-start gap-1.5 py-1 px-1.5 rounded hover:bg-neutral-800/50 transition-colors text-left w-full group/t">
                            <span className="mt-1.5 flex-shrink-0 w-1 h-1 rounded-full bg-neutral-800 group-hover/t:bg-neutral-600 transition-colors" />
                            <span className={`text-xs leading-relaxed select-none transition-all ${tema.completado ? 'text-violet-400/60 underline decoration-violet-500/50 decoration-1 underline-offset-2' : 'text-neutral-500 group-hover/t:text-neutral-300'}`}>{tema.titulo}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export default function PomodoroPage() {
    const location       = useLocation();
    const navigate       = useNavigate();
    const autoOpenConfig = location.state?.openConfig ?? false;

    const [plan, setPlan] = useState(location.state?.plan ?? null);
    const [sesionCompleta, setSesionCompleta] = useState(false);
    const [sesionesCompletadas, setSesionesCompletadas] = useState(0);

    const [timerConfig, setTimerConfig] = useState({
        focus: 25,
        break: 5,
        longBreakFreq: 4,
        longBreak: 15,
        rounds: 4
    });

    // 🔴 useCallback asegura que la función no se re-cree en cada render
    const handleConfigChange = useCallback((config) => {
        setTimerConfig(config);
    }, []);

    const toggleTopic = async (temaId) => {
        // Logica de toggle
        setPlan(prev => ({ ...prev /*... tu logica ...*/ }));
    };

    const handleTimerComplete = () => {
        setSesionCompleta(true);
        setSesionesCompletadas(prev => prev + 1);
    };

    const isLongBreak = sesionesCompletadas > 0 && sesionesCompletadas % timerConfig.longBreakFreq === 0;

    const totalTopics     = plan?.modulos?.reduce((acc, m) => acc + (m.temas?.length ?? 0), 0) ?? 0;
    const completedTopics = plan?.modulos?.reduce((acc, m) => acc + (m.temas?.filter(t => t.completado).length ?? 0), 0) ?? 0;
    const planProgress    = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

    return (
        <div className="h-full flex flex-col p-4 md:p-6 lg:p-8 text-white font-sans selection:bg-violet-500/30">

            <div className="flex items-center justify-between border-b border-neutral-800 pb-2 mb-4">
                <h1 className="text-[10px] font-mono text-neutral-400 tracking-widest uppercase">Active_Terminal</h1>
                <div className="hidden md:flex items-center gap-4 text-[10px] font-mono tracking-widest uppercase">
                    <span className="text-violet-400 cursor-pointer">Focus_Session</span>

                    {/* 🔴 EL BOTÓN ENVÍA LA CONFIGURACIÓN ACTIVA */}
                    <button
                        onClick={() => navigate('/focus-mode', {
                            state: {
                                topic: plan ? { titulo: plan.titulo } : null,
                                focusDuration: timerConfig.focus * 60,
                                shortBreakDuration: timerConfig.break * 60,
                                sesionesCompletadas: sesionesCompletadas,
                                longBreakFreq: timerConfig.longBreakFreq,
                                longBreakDuration: timerConfig.longBreak * 60,
                                totalRounds: timerConfig.rounds
                            }
                        })}
                        className="flex items-center gap-2 px-3 py-1.5 bg-violet-600/10 text-violet-400 hover:bg-violet-600/20 border border-violet-500/20 rounded-lg transition-all font-semibold"
                    >
                        <Maximize2 className="w-3.5 h-3.5" />
                        Deep Focus
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start flex-grow">
                <div className="lg:col-span-8 flex flex-col gap-4">

                    {/* 🔴 AQUÍ PASAMOS EL HANDLE AL TIMER */}
                    <MainTimerCard
                        autoOpenConfig={autoOpenConfig}
                        onComplete={handleTimerComplete}
                        onConfigChange={handleConfigChange}
                    />

                    {sesionCompleta && (
                        <div className={`flex items-center gap-4 border rounded-xl px-5 py-4 shadow-lg ${isLongBreak ? 'bg-blue-500/10 border-blue-500/20' : 'bg-emerald-500/10 border-emerald-500/20'}`}>
                            <div>
                                <p className={`text-sm font-bold ${isLongBreak ? 'text-blue-400' : 'text-emerald-400'}`}>
                                    ¡Sesión completada! ({sesionesCompletadas} ciclos)
                                </p>
                                <p className="text-xs text-neutral-400 mt-0.5">
                                    {isLongBreak ? `Toca un descanso largo (${timerConfig.longBreak} min).` : `Toca un descanso corto (${timerConfig.break} min).`}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Columna derecha — Plan de estudio */}
                <div className="lg:col-span-4 flex flex-col gap-5 self-stretch">
                    <div className="bg-[#0c0c0c] border border-neutral-800 rounded-2xl p-4 flex flex-col flex-grow lg:h-0 lg:min-h-0 overflow-hidden">
                        {plan ? (
                            <>
                                <div className="flex items-start justify-between mb-3 flex-shrink-0 gap-2">
                                    <div className="min-w-0">
                                        <p className="text-xs text-neutral-500 tracking-widest uppercase mb-1">
                                            Temario · Sesión activa
                                        </p>
                                        <h2 className="text-base font-bold text-white leading-tight truncate">
                                            {plan.titulo}
                                        </h2>
                                        <p className="text-xs text-neutral-600 mt-0.5">
                                            {plan.modulos?.length ?? 0} módulos · {totalTopics} temas
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => navigate('/study-plan')}
                                        className="flex-shrink-0 text-[9px] text-neutral-600 hover:text-violet-400 transition-colors font-mono uppercase tracking-wider"
                                        title="Ir a Plan de Estudio"
                                    >
                                        ←
                                    </button>
                                </div>
                                <div className="flex-grow overflow-y-auto pr-0.5 min-h-0 flex flex-col gap-0.5 custom-scrollbar">
                                    {plan.modulos?.map(modulo => (
                                        <ModuleItem
                                            key={modulo.id}
                                            modulo={modulo}
                                            onToggle={toggleTopic}
                                        />
                                    ))}
                                </div>
                                <div className="mt-3 flex-shrink-0 border-t border-neutral-800/60 pt-3">
                                    <div className="flex justify-between text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                                        <span>Avance</span>
                                        <span>{completedTopics}/{totalTopics} · {planProgress}%</span>
                                    </div>
                                    <div className="h-1 w-full bg-neutral-800 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-violet-600 rounded-full transition-all duration-300"
                                            style={{ width: `${planProgress}%` }}
                                        />
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="flex items-center justify-between mb-4 flex-shrink-0">
                                    <h2 className="text-[9px] font-mono text-neutral-400 tracking-widest uppercase">Job_Queue</h2>
                                    <button
                                        onClick={() => navigate('/study-plan')}
                                        className="w-5 h-5 rounded border border-neutral-700 flex items-center justify-center text-xs text-neutral-400 hover:bg-neutral-800 transition-colors"
                                        title="Ir a Plan de Estudio"
                                    >
                                        +
                                    </button>
                                </div>
                                <div className="space-y-3 overflow-y-auto pr-1 flex-grow min-h-0">
                                    <div className="border border-neutral-700 bg-neutral-900/30 p-3 rounded-xl flex gap-3">
                                        <div className="w-3.5 h-3.5 rounded border border-violet-500 bg-violet-500/20 mt-0.5"></div>
                                        <h3 className="text-xs font-medium text-neutral-200">Cognitive Psychology Review</h3>
                                    </div>
                                </div>
                                <div className="mt-4 border border-neutral-800 p-3 rounded-xl bg-black/50 flex-shrink-0">
                                    <p className="text-[10px] font-mono text-neutral-500 italic leading-tight">
                                        "// Focus is the new IQ."
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
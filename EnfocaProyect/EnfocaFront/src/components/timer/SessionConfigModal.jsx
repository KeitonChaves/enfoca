import { useState } from 'react';

const INTENSITIES = [
    { id: 'LIGHT_FLOW',   study: 15, rest: 5,  cycle: 20, desc: '15m estudio · 5m descanso',  longBreakFreq: 6, longBreak: 15 },
    { id: 'STANDARD_POM', study: 25, rest: 5,  cycle: 30, desc: '25m estudio · 5m descanso',  longBreakFreq: 4, longBreak: 15 },
    { id: 'DEEP_WORK',    study: 40, rest: 5,  cycle: 45, desc: '40m estudio · 5m descanso',  longBreakFreq: 3, longBreak: 20 },
    { id: 'EXTENDED_LOG', study: 50, rest: 10, cycle: 60, desc: '50m estudio · 10m descanso', longBreakFreq: 2, longBreak: 30 },
];

function CardContent({ lvl, state, rounds }) {
    return (
        <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
                <p className={`text-sm font-bold tracking-wide uppercase ${
                    state === 'compatible'   ? 'text-violet-400' :
                        state === 'incompatible' ? 'text-neutral-700 line-through' :
                            'text-neutral-600'
                }`}>
                    {lvl.id}
                </p>
                <p className={`text-xs mt-1 ${
                    state === 'compatible' ? 'text-neutral-400' : 'text-neutral-700'
                }`}>
                    {lvl.desc} · ciclo {lvl.cycle}m
                </p>
                {state === 'compatible' && (
                    <p className="text-xs text-violet-500/70 mt-1">
                        {rounds} Ronda{rounds !== 1 ? 's' : ''} calculadas
                    </p>
                )}
            </div>
            <div className="flex-shrink-0">
                {state === 'compatible' && (
                    <span className="text-lg text-violet-400 font-bold">{rounds}×</span>
                )}
                {state === 'incompatible' && (
                    <span className="text-[10px] text-neutral-700 uppercase tracking-widest leading-tight text-right block">
                        NO<br />COMPATIBLE
                    </span>
                )}
            </div>
        </div>
    );
}

export default function SessionConfigModal({ onConfirm, onClose }) {
    const [minutes,   setMinutes]   = useState('');
    const [showError, setShowError] = useState(false);

    const mins     = parseInt(minutes, 10);
    const hasInput = !isNaN(mins) && mins > 0;

    const handleClose = () => {
        if (!hasInput) {
            setShowError(true);
            return;
        }
        onClose();
    };

    const handleBackdrop = (e) => {
        if (e.target !== e.currentTarget) return;
        if (!hasInput) {
            setShowError(true);
            return;
        }
        onClose();
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md"
            onClick={handleBackdrop}
        >
            <div className="bg-[#000] border border-[#1a1a1a] rounded-2xl w-full max-w-[520px] mx-4 shadow-[0_0_60px_rgba(139,92,246,0.07)] overflow-hidden">

                <div className="flex items-start justify-between px-7 py-6 border-b border-[#1a1a1a]">
                    <div>
                        <p className="text-xs text-violet-500/60 tracking-[0.25em] uppercase mb-2">
                            ENFOCA · SESSION CONFIG
                        </p>
                        <h2 className="text-2xl font-bold text-white">
                            Configurar Sesión
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="mt-1 text-neutral-600 hover:text-neutral-300 transition-colors p-1"
                    >
                        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M18 6L6 18M6 6l12 12"/>
                        </svg>
                    </button>
                </div>

                <div className="px-7 py-7 border-b border-[#1a1a1a]">
                    <label className="text-xs font-semibold text-neutral-500 uppercase tracking-[0.25em] block mb-4">
                        → Minutos disponibles
                    </label>
                    <div className="flex items-baseline gap-4">
                        <input
                            type="number"
                            min="1"
                            max="480"
                            value={minutes}
                            onChange={e => { setMinutes(e.target.value); setShowError(false); }}
                            placeholder="60"
                            autoFocus
                            className={`w-32 bg-transparent border-b-2 outline-none text-6xl font-bold text-white tabular-nums transition-colors pb-1
                                       [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
                                       ${showError ? 'border-red-500' : 'border-neutral-800 focus:border-violet-500'}`}
                        />
                        <span className="text-neutral-500 text-lg uppercase tracking-wide">min</span>
                    </div>
                    {showError && (
                        <p className="text-xs text-red-400 mt-3 font-semibold">
                            Debes ingresar los minutos disponibles para continuar.
                        </p>
                    )}
                    {hasInput && !showError && (
                        <p className="text-xs text-neutral-600 mt-3 uppercase tracking-widest">
                            → {mins} minutos · selecciona la intensidad compatible
                        </p>
                    )}
                </div>

                <div className="px-7 py-6 flex flex-col gap-3">
                    <p className="text-xs font-semibold text-neutral-500 uppercase tracking-[0.25em] mb-1">
                        → Seleccionar intensidad
                    </p>

                    {INTENSITIES.map(lvl => {
                        if (!hasInput) {
                            return (
                                <div key={lvl.id} className="border border-[#1a1a1a] rounded-xl px-5 py-4 opacity-30 select-none cursor-default">
                                    <CardContent lvl={lvl} state="neutral" rounds={0} />
                                </div>
                            );
                        }

                        const rounds     = Math.floor(mins / lvl.cycle);
                        const compatible = mins % lvl.cycle === 0 && rounds > 0;

                        if (compatible) {
                            return (
                                <button
                                    key={lvl.id}
                                    onClick={() => onConfirm({
                                        studyMinutes: lvl.study,
                                        breakMinutes: lvl.rest,
                                        rounds,
                                        intensityId:  lvl.id,
                                        // AQUÍ ENVIAMOS LOS DATOS CLAVE
                                        longBreakFreq: lvl.longBreakFreq,
                                        longBreakMinutes: lvl.longBreak
                                    })}
                                    className="border border-violet-500/30 bg-violet-500/5 hover:bg-violet-500/10 hover:border-violet-500/60 rounded-xl px-5 py-4 text-left transition-all active:scale-[0.99]"
                                >
                                    <CardContent lvl={lvl} state="compatible" rounds={rounds} />
                                </button>
                            );
                        }

                        return (
                            <div key={lvl.id} className="border border-[#1a1a1a] rounded-xl px-5 py-4 opacity-20 select-none cursor-default">
                                <CardContent lvl={lvl} state="incompatible" rounds={0} />
                            </div>
                        );
                    })}
                </div>

                <div className="px-7 pb-6">
                    <div className="border border-amber-500/20 bg-amber-500/5 rounded-xl p-4">
                        <p className="text-[10px] font-bold tracking-widest uppercase text-amber-500/70 mb-2">
                            ⚠ Solo para demostración
                        </p>
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <p className="text-xs text-neutral-400">Sesión de 1 minuto · 0 min descanso</p>
                            </div>
                            <button
                                onClick={() => onConfirm({
                                    studyMinutes: 1,
                                    breakMinutes: 0,
                                    rounds:       1,
                                    intensityId:  'DEMO_MODE',
                                    longBreakFreq: 2,
                                    longBreakMinutes: 1
                                })}
                                className="flex-shrink-0 px-4 py-2 rounded-lg border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-xs font-bold transition-all"
                            >
                                Iniciar demo
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
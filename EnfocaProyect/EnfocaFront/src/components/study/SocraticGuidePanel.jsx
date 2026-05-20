import { useState } from 'react';

const IconSearch = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
);
const IconDiff = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 3v18M3 12h18"/>
    </svg>
);
const IconQuestion = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="10"/>
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
        <line x1="12" y1="17" x2="12.01" y2="17" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
);
const IconChevron = ({ open }) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
         className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>
        <polyline points="6 9 12 15 18 9"/>
    </svg>
);

export default function SocraticGuidePanel({ guiaSocratica, temaActivo }) {
    const [open, setOpen] = useState(false);

    if (!guiaSocratica || !temaActivo) return null;

    let guia = null;
    try {
        guia = typeof guiaSocratica === 'string' ? JSON.parse(guiaSocratica) : guiaSocratica;
    } catch {
        return null;
    }

    const { que_investigar = [], diferencias_clave = [], preguntas_guia = [] } = guia;

    return (
        <div className="bg-[#0c0c0c] border border-violet-500/20 rounded-xl overflow-hidden">
            <button
                onClick={() => setOpen(v => !v)}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-violet-600/5 transition-colors"
            >
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
                    <span className="text-xs font-semibold text-violet-300 tracking-wider uppercase">
                        Guía Socrática — {temaActivo.titulo}
                    </span>
                </div>
                <IconChevron open={open} />
            </button>

            {open && (
                <div className="px-4 pb-4 flex flex-col gap-4 border-t border-violet-500/10">
                    <p className="text-[10px] text-neutral-600 mt-3 italic">
                        No busques la respuesta directa — usa estas guías para construir tu propio entendimiento.
                    </p>

                    {que_investigar.length > 0 && (
                        <div>
                            <div className="flex items-center gap-1.5 mb-2 text-[10px] font-semibold text-neutral-400 uppercase tracking-widest">
                                <IconSearch /> Investiga por tu cuenta
                            </div>
                            <ul className="flex flex-col gap-1">
                                {que_investigar.map((item, i) => (
                                    <li key={i} className="text-xs text-neutral-300 flex items-start gap-2">
                                        <span className="text-violet-500 mt-0.5">›</span> {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {diferencias_clave.length > 0 && (
                        <div>
                            <div className="flex items-center gap-1.5 mb-2 text-[10px] font-semibold text-neutral-400 uppercase tracking-widest">
                                <IconDiff /> Diferencias clave
                            </div>
                            <ul className="flex flex-col gap-1">
                                {diferencias_clave.map((item, i) => (
                                    <li key={i} className="text-xs text-amber-400/80 flex items-start gap-2">
                                        <span className="mt-0.5">⇄</span> {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {preguntas_guia.length > 0 && (
                        <div>
                            <div className="flex items-center gap-1.5 mb-2 text-[10px] font-semibold text-neutral-400 uppercase tracking-widest">
                                <IconQuestion /> Preguntas de autoexamen
                            </div>
                            <ol className="flex flex-col gap-2">
                                {preguntas_guia.map((preg, i) => (
                                    <li key={i} className="text-xs text-neutral-300 bg-neutral-900/50 rounded-lg px-3 py-2 border border-neutral-800">
                                        <span className="text-violet-400 font-mono mr-1">{i + 1}.</span> {preg}
                                    </li>
                                ))}
                            </ol>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

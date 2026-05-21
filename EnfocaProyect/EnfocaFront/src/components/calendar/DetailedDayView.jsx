import React from 'react';

const IconTrash = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <polyline points="3 6 5 6 21 6"/>
        <path d="M19 6l-1 14H6L5 6"/>
        <path d="M10 11v6"/><path d="M14 11v6"/>
        <path d="M9 6V4h6v2"/>
    </svg>
);

export default function DetailedDayView({ dayData, onTopicClick, onDelete }) {

    const formatearTituloLocal = (fechaStr) => {
        if (!fechaStr) return '';
        const [year, month, day] = fechaStr.split('-');
        return new Date(year, month - 1, day)
            .toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })
            .toUpperCase();
    };

    return (
        <div className="bg-[#0c0c0c] border border-neutral-800 rounded-2xl p-6 max-w-3xl mx-auto">
            <div className="border-b border-neutral-800 pb-4 mb-6">
                <span className="text-[9px] font-mono text-violet-400 tracking-widest uppercase">Focus_Target_Day</span>
                <h2 className="text-2xl font-light mt-1">{formatearTituloLocal(dayData.fecha)}</h2>
            </div>

            <div className="space-y-4">
                {dayData.temas && dayData.temas.length > 0 ? (
                    dayData.temas.map((tema) => {
                        const pct = tema.pomodorosEstimados > 0
                            ? Math.round((tema.pomodorosCompletados / tema.pomodorosEstimados) * 100)
                            : 0;
                        return (
                            <div
                                key={tema.id}
                                className="border border-neutral-800 bg-black/40 p-5 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-violet-500/30 transition-all group"
                            >
                                <div
                                    className="space-y-1 flex-grow cursor-pointer"
                                    onClick={() => onTopicClick(tema)}
                                >
                                    <span className="text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-400">
                                        {tema.moduloTitulo}
                                    </span>
                                    <h3 className="text-base font-medium text-white group-hover:text-violet-400 transition-colors pt-1">
                                        {tema.titulo}
                                    </h3>
                                </div>

                                <div className="flex items-center gap-4 min-w-[220px]">
                                    <div className="flex-1 space-y-1">
                                        <div className="flex justify-between text-[10px] font-mono text-neutral-500">
                                            <span>PROGRESS</span>
                                            <span>{pct}%</span>
                                        </div>
                                        <div className="w-full h-1 bg-neutral-900 border border-neutral-800 rounded-full overflow-hidden">
                                            <div style={{ width: `${pct}%` }} className="h-full bg-violet-500 rounded-full" />
                                        </div>
                                    </div>

                                    <div className="bg-neutral-900 border border-neutral-800 px-3 py-1.5 rounded-lg text-center font-mono">
                                        <div className="text-[10px] text-neutral-500">POMS</div>
                                        <div className="text-xs text-white">{tema.pomodorosCompletados}/{tema.pomodorosEstimados}</div>
                                    </div>

                                    {onDelete && (
                                        <button
                                            onClick={(e) => { e.stopPropagation(); onDelete(tema.id, dayData.fecha); }}
                                            title="Eliminar del calendario"
                                            className="flex-shrink-0 p-2 rounded-lg text-neutral-600 hover:text-red-400 hover:bg-red-500/10 border border-neutral-800 hover:border-red-500/20 transition-all"
                                        >
                                            <IconTrash />
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="text-center py-12 border border-dashed border-neutral-800 rounded-xl">
                        <p className="text-sm text-neutral-500">No hay temas programados para este día</p>
                    </div>
                )}
            </div>
        </div>
    );
}

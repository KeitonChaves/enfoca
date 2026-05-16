// src/components/calendar/DetailedDayView.jsx
import React from 'react';

export default function DetailedDayView({ dayData, onTopicClick }) {

    // Función a prueba de balas para evitar desfases de Zona Horaria
    const formatearTituloLocal = (fechaStr) => {
        if (!fechaStr) return '';
        // Separamos "2026-05-03" en [2026, 05, 03]
        const [year, month, day] = fechaStr.split('-');

        // Al instanciar Date con números (año, mes - 1, día), JS asume 100% la hora local
        const dateObj = new Date(year, month - 1, day);

        return dateObj.toLocaleDateString('es-ES', {
            weekday: 'long',
            day: 'numeric',
            month: 'long'
        }).toUpperCase();
    };

    return (
        <div className="bg-[#0c0c0c] border border-neutral-800 rounded-2xl p-6 max-w-3xl mx-auto">
            <div className="border-b border-neutral-800 pb-4 mb-6">
                <span className="text-[9px] font-mono text-violet-400 tracking-widest uppercase">Focus_Target_Day</span>
                <h2 className="text-2xl font-light mt-1">
                    {/* Usamos nuestra función segura en lugar de new Date directo */}
                    {formatearTituloLocal(dayData.fecha)}
                </h2>
            </div>

            <div className="space-y-4">
                {dayData.temas && dayData.temas.length > 0 ? (
                    dayData.temas.map((tema) => {
                        const pct = Math.round((tema.pomodorosCompletados / tema.pomodorosEstimados) * 100);
                        return (
                            <div
                                key={tema.id}
                                onClick={() => onTopicClick(tema)}
                                className="border border-neutral-800 bg-black/40 p-5 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-violet-500/50 cursor-pointer transition-all group"
                            >
                                <div className="space-y-1 flex-grow">
                                    <span className="text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-400">
                                        {tema.moduloTitulo}
                                    </span>
                                    <h3 className="text-base font-medium text-white group-hover:text-violet-400 transition-colors pt-1">
                                        {tema.titulo}
                                    </h3>
                                </div>

                                <div className="flex items-center gap-6 min-w-[200px]">
                                    <div className="w-full space-y-1">
                                        <div className="flex justify-between text-[10px] font-mono text-neutral-500">
                                            <span>PROGRESS</span>
                                            <span>{pct}%</span>
                                        </div>
                                        <div className="w-full h-1 bg-neutral-900 border border-neutral-800 rounded-full overflow-hidden">
                                            <div style={{ width: `${pct}%` }} className="h-full bg-violet-500 rounded-full"></div>
                                        </div>
                                    </div>

                                    <div className="bg-neutral-900 border border-neutral-800 px-3 py-1.5 rounded-lg text-center font-mono">
                                        <div className="text-[10px] text-neutral-500">POMS</div>
                                        <div className="text-xs text-white">{tema.pomodorosCompletados}/{tema.pomodorosEstimados}</div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="text-center py-12 border border-dashed border-neutral-800 rounded-xl">
                        <p className="font-mono text-xs text-neutral-500 uppercase tracking-widest">// NO TASKS ALLOCATED FOR THIS INDEX</p>
                    </div>
                )}
            </div>
        </div>
    );
}
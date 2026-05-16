// src/components/calendar/WeeklySummarySidebar.jsx
import React from 'react';
import { Target, CheckSquare, Clock, TrendingUp } from 'lucide-react';

export default function WeeklySummarySidebar({ summary, isLoading }) {
    if (isLoading) {
        return (
            <div className="bg-white dark:bg-[#0c0c0c] border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 h-full min-h-[400px] flex items-center justify-center">
                <div className="animate-pulse flex flex-col items-center gap-4">
                    <div className="w-12 h-12 bg-neutral-200 dark:bg-neutral-800 rounded-full"></div>
                    <div className="w-32 h-4 bg-neutral-200 dark:bg-neutral-800 rounded"></div>
                </div>
            </div>
        );
    }

    const data = summary || {
        totalTemas: 0,
        temasCompletados: 0,
        porcentajeAvance: 0,
        horasPlanificadas: 0
    };

    return (
        // Agregamos h-full y flex-col para que ocupe toda la altura del calendario
        <div className="bg-white dark:bg-[#0c0c0c] border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 sticky top-6 h-full flex flex-col">

            <h2 className="text-sm font-semibold mb-6 flex items-center gap-2 text-neutral-800 dark:text-neutral-200">
                <TrendingUp className="w-4 h-4 text-violet-500" />
                Resumen de la Semana
            </h2>

            {/* Este div empuja los elementos para distribuirlos mejor */}
            <div className="space-y-6 flex-grow flex flex-col">

                <div className="flex flex-col items-center justify-center p-6 bg-neutral-50 dark:bg-neutral-900/50 rounded-xl border border-neutral-100 dark:border-neutral-800/50 flex-grow">
                    <div className="text-5xl font-light tabular-nums text-violet-600 dark:text-violet-400">
                        {data.porcentajeAvance}<span className="text-2xl text-neutral-400">%</span>
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 mt-3">
                        Avance Semanal
                    </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 border border-neutral-100 dark:border-neutral-800 rounded-lg flex flex-col justify-center">
                        <Target className="w-5 h-5 text-neutral-400 mb-2" />
                        <div className="text-2xl font-semibold">{data.totalTemas}</div>
                        <div className="text-[9px] font-mono text-neutral-500 uppercase tracking-wider mt-1">Planificados</div>
                    </div>

                    <div className="p-4 border border-neutral-100 dark:border-neutral-800 rounded-lg flex flex-col justify-center">
                        <CheckSquare className="w-5 h-5 text-green-500 mb-2" />
                        <div className="text-2xl font-semibold text-green-600 dark:text-green-400">{data.temasCompletados}</div>
                        <div className="text-[9px] font-mono text-neutral-500 uppercase tracking-wider mt-1">Completados</div>
                    </div>
                </div>

                <div className="flex items-center justify-between p-4 border border-neutral-100 dark:border-neutral-800 rounded-lg bg-neutral-50 dark:bg-neutral-900/30">
                    <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-violet-500" />
                        <span className="text-xs font-medium">Tiempo Estimado</span>
                    </div>
                    <span className="text-lg font-bold font-mono">
                        {data.horasPlanificadas} <span className="text-neutral-500 font-normal text-sm">hrs</span>
                    </span>
                </div>
            </div>

            {/* mt-auto empuja la frase hasta el fondo de la tarjeta */}
            <div className="mt-auto pt-6 border-t border-neutral-100 dark:border-neutral-800 text-center">
                <p className="text-[10px] font-mono italic text-neutral-500">
                    "La constancia es la clave del progreso."
                </p>
            </div>
        </div>
    );
}
// src/components/calendar/WeekSelector.jsx
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function WeekSelector({ view, baseDate, onNext, onPrevious, onToday }) {

    // Función para formatear el texto central dependiendo de la vista seleccionada
    const formatTitle = () => {
        if (!baseDate) return '';

        if (view === 'month') {
            // Ejemplo: "Mayo 2026"
            return baseDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
        }

        if (view === 'day') {
            // Ejemplo: "Lunes, 27 de abril"
            return baseDate.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
        }

        // Lógica para la vista de Semana (calcula el Lunes y el Domingo de esa semana)
        const d = new Date(baseDate);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1);
        const start = new Date(d.setDate(diff));

        const end = new Date(start);
        end.setDate(start.getDate() + 6);

        const startStr = start.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
        const endStr = end.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });

        return `Semana del ${startStr} al ${endStr}`;
    };

    return (
        <div className="flex items-center gap-2 bg-white dark:bg-[#0c0c0c] border border-neutral-200 dark:border-neutral-800 p-1 rounded-lg shadow-sm">
            <button
                onClick={onPrevious}
                className="p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md transition-colors text-neutral-500 dark:text-neutral-400"
                aria-label="Anterior"
            >
                <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="px-4 text-sm font-medium text-neutral-700 dark:text-neutral-200 min-w-[220px] text-center capitalize">
                {formatTitle()}
            </div>

            <button
                onClick={onNext}
                className="p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md transition-colors text-neutral-500 dark:text-neutral-400"
                aria-label="Siguiente"
            >
                <ChevronRight className="w-5 h-5" />
            </button>

            <div className="w-[1px] h-6 bg-neutral-200 dark:bg-neutral-800 mx-1"></div>

            <button
                onClick={onToday}
                className="px-3 py-1.5 text-xs font-semibold text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-500/10 rounded-md transition-colors uppercase tracking-wider"
            >
                Hoy
            </button>
        </div>
    );
}
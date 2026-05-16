// src/components/calendar/DayCard.jsx
import React from 'react';
import CalendarTopicCard from './CalendarTopicCard';

export default function DayCard({ dayData }) {
    // Nombres de los días en español para asegurar consistencia
    const getDayName = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', { weekday: 'short' });
    };

    const getDayNumber = (dateString) => {
        const date = new Date(dateString);
        return date.getDate();
    };

    // Determinar si este día es "hoy" para resaltarlo
    const isToday = new Date().toISOString().split('T')[0] === dayData.fecha;

    // Función que manejará el clic en el tema
    const handleTopicClick = (topic) => {
        console.log("Abrir modal para el tema:", topic.titulo);
        // TODO: Sincronizar con el estado del modal en WeeklyCalendarPage
    };

    return (
        <div className={`flex flex-col h-full min-h-[400px] border rounded-xl overflow-hidden transition-colors ${
            isToday
                ? 'border-violet-500/50 bg-violet-50/30 dark:bg-violet-900/10'
                : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#0c0c0c]'
        }`}>
            {/* Encabezado del Día */}
            <div className={`py-3 flex flex-col items-center justify-center border-b ${
                isToday
                    ? 'border-violet-500/30 text-violet-700 dark:text-violet-400'
                    : 'border-neutral-100 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400'
            }`}>
                <span className="text-[10px] font-mono uppercase tracking-widest mb-1">
                    {getDayName(dayData.fecha)}
                </span>
                <span className={`text-2xl font-light ${isToday ? 'font-medium' : ''}`}>
                    {getDayNumber(dayData.fecha)}
                </span>
            </div>

            {/* Contenedor de Temas (Scrollable si hay muchos) */}
            <div className="flex-grow p-2 overflow-y-auto custom-scrollbar space-y-2">
                {dayData.temas && dayData.temas.length > 0 ? (
                    dayData.temas.map((tema) => (
                        <CalendarTopicCard
                            key={tema.id}
                            topic={tema}
                            onClick={handleTopicClick}
                        />
                    ))
                ) : (
                    <div className="h-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer group">
                        <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest text-center border border-dashed border-neutral-300 dark:border-neutral-700 rounded-lg p-2 w-full group-hover:border-violet-500 group-hover:text-violet-500 transition-colors">
                            + Planificar
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}
// src/components/calendar/WeeklyGrid.jsx
import React from 'react';
import CalendarTopicCard from './CalendarTopicCard';

// Recibimos onStartFocus por props
export default function WeeklyGrid({ days, onDayClick, onTopicClick, onStartFocus }) {

    // Función segura para obtener la fecha de hoy en formato local YYYY-MM-DD
    const getTodayLocalStr = () => {
        const hoy = new Date();
        const year = hoy.getFullYear();
        const month = String(hoy.getMonth() + 1).padStart(2, '0');
        const day = String(hoy.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const todayStr = getTodayLocalStr();

    return (
        <div className="w-full overflow-x-auto pb-4 custom-scrollbar">
            <div className="grid grid-cols-1 md:grid-cols-7 gap-1 h-full min-w-full md:min-w-[1050px]">
                {days.map((day) => {
                    const isToday = todayStr === day.fecha;

                    // CORRECCIÓN: Forzamos la hora local reemplazando los guiones por barras
                    const dateObj = new Date(day.fecha.replace(/-/g, '\/'));

                    return (
                        <div
                            key={day.fecha}
                            className={`flex flex-col h-full min-h-[420px] border rounded-xl overflow-hidden bg-black/20 ${isToday ? 'border-violet-500/40 bg-violet-500/[0.02]' : 'border-neutral-800'}`}
                        >
                            {/* Clic en cabecera abre vista detallada del día */}
                            <div
                                onClick={() => onDayClick(day.fecha)}
                                className="py-3 flex flex-col items-center justify-center border-b border-neutral-900 bg-neutral-900/20 cursor-pointer hover:bg-neutral-900/50 transition-colors"
                            >
                                <span className="text-[14px] font-mono uppercase tracking-widest text-neutral-500">
                                    {dateObj.toLocaleDateString('es-ES', { weekday: 'short' })}
                                </span>
                                <span className={`text-xl font-light mt-0.5 ${isToday ? 'text-violet-400 font-medium' : 'text-white'}`}>
                                    {dateObj.getDate()}
                                </span>
                            </div>

                            <div className="flex-grow p-2 overflow-y-auto custom-scrollbar space-y-2">
                                {day.temas && day.temas.length > 0 ? (
                                    day.temas.map((tema) => (
                                        <CalendarTopicCard
                                            key={tema.id}
                                            topic={{ ...tema, fecha: day.fecha }} // Inyectamos la fecha
                                            onClick={onTopicClick}
                                            onStartFocus={onStartFocus} // Pasamos la función
                                        />
                                    ))
                                ) : (
                                    <div onClick={() => onDayClick(day.fecha)} className="h-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                                        <span className="text-[9px] font-mono text-neutral-600 uppercase tracking-widest border border-dashed border-neutral-800 rounded-lg p-2 w-full text-center hover:border-neutral-700 hover:text-neutral-400">
                                            + Allocate
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
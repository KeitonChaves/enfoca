// src/components/calendar/MonthView.jsx
import React from 'react';

export default function MonthView({ days, onDayClick, onTopicClick }) {
    const weekDays = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM'];

    return (
        <div className="bg-[#0c0c0c] border border-neutral-800 rounded-2xl p-4">
            <div className="grid grid-cols-7 gap-1 text-center font-mono text-[9px] text-neutral-500 mb-2">
                {weekDays.map(d => <div key={d} className="py-1">{d}</div>)}
            </div>

            <div className="grid grid-cols-7 gap-1.5 auto-rows-[79px]">
                {days.map((day, idx) => {
                    if (day.padding) {
                        return <div key={`pad-${idx}`} className="bg-neutral-900/10 rounded-lg border border-transparent"></div>;
                    }

                    return (
                        <div
                            key={day.fecha}
                            onClick={() => onDayClick(day.fecha)}
                            className="bg-black/40 border border-neutral-900 hover:border-neutral-700 p-1.5 rounded-lg flex flex-col gap-1 cursor-pointer transition-colors group"
                        >
                            <span className="text-xs font-mono text-neutral-500 group-hover:text-white transition-colors">
                                {day.dayNumber}
                            </span>

                            <div className="flex-grow overflow-y-auto space-y-1 custom-scrollbar">
                                {day.temas?.map(tema => (
                                    <div
                                        key={tema.id}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onTopicClick(tema);
                                        }}
                                        style={{ borderColor: tema.color, backgroundColor: `${tema.color}15` }}
                                        className="text-[12px] font-mono p-1 rounded border truncate text-white hover:brightness-125"
                                    >
                                        {tema.titulo}
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
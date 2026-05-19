// src/components/calendar/CalendarTopicCard.jsx
import React from 'react';
import { CheckCircle2, CircleDashed, Clock, Play } from 'lucide-react';

export default function CalendarTopicCard({ topic, onClick, onStartFocus }) {
    const isCompleted = topic.completado;
    const isPending = !isCompleted && topic.pomodorosCompletados === 0;
    const isInProgress = !isCompleted && topic.pomodorosCompletados > 0;

    let stateClasses = "";
    let Icon = Clock;
    let iconColor = "";

    if (isCompleted) {
        stateClasses = "bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800/50";
        Icon = CheckCircle2;
        iconColor = "text-green-500";
    } else if (isPending) {
        stateClasses = "bg-transparent border-dashed border-neutral-300 dark:border-neutral-700 opacity-70 hover:opacity-100";
        Icon = CircleDashed;
        iconColor = "text-neutral-400";
    } else if (isInProgress) {
        stateClasses = "bg-white dark:bg-[#111111] border-violet-200 dark:border-violet-800/50 shadow-sm";
        Icon = Clock;
        iconColor = "text-violet-500";
    }

    return (
        <div
            onClick={() => onClick(topic)}
            className={`w-full text-left p-2.5 rounded-lg border transition-all hover:shadow-md cursor-pointer group flex flex-col gap-1.5 relative ${stateClasses}`}
        >
            <div className="flex items-start justify-between gap-2">
                <h4 className={`text-xs font-medium leading-tight line-clamp-2 pr-4 ${isCompleted ? 'text-green-800 dark:text-green-300' : 'text-neutral-800 dark:text-neutral-200'}`}>
                    {topic.titulo}
                </h4>
                <Icon className={`w-3.5 h-3.5 flex-shrink-0 mt-0.5 ${iconColor}`} />
            </div>

            <div className="flex items-center justify-between mt-1">
                <span className="text-[9px] font-mono uppercase tracking-wider text-neutral-500 truncate max-w-[70%]">
                    {topic.moduloTitulo}
                </span>

                <span className={`text-[10px] font-mono px-1.5 rounded ${
                    isCompleted
                        ? 'bg-green-100 dark:bg-green-800/30 text-green-700 dark:text-green-400'
                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                }`}>
                    {topic.pomodorosCompletados}/{topic.pomodorosEstimados}
                </span>
            </div>

            {isInProgress && (
                <div className="w-full h-1 bg-neutral-100 dark:bg-neutral-800 rounded-full mt-1 overflow-hidden">
                    <div
                        className="h-full bg-violet-500 rounded-full"
                        style={{ width: `${(topic.pomodorosCompletados / topic.pomodorosEstimados) * 100}%` }}
                    ></div>
                </div>
            )}

            {/* BOTÓN PLAY RÁPIDO (Solo visible en hover si no está completado) */}
            {!isCompleted && onStartFocus && (
                <button
                    onClick={(e) => {
                        e.stopPropagation(); // Evita que se abra el modal
                        onStartFocus(topic);
                    }}
                    className="absolute bottom-2 right-2 p-1.5 bg-violet-600 hover:bg-violet-500 text-white rounded-md shadow-sm transition-all opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0"
                    title="Iniciar Pomodoro"
                >
                    <Play className="w-3 h-3 fill-current" />
                </button>
            )}
        </div>
    );
}
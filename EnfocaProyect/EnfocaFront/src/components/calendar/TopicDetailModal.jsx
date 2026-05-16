// src/components/calendar/TopicDetailModal.jsx
import React from 'react';
import { X, Play, CheckCircle2, Clock, CircleDashed } from 'lucide-react';

export default function TopicDetailModal({ isOpen, onClose, topic, onStartFocus }) {
    if (!isOpen || !topic) return null;

    // Lógica de estados
    const isCompleted = topic.completado;
    const isPending = !isCompleted && topic.pomodorosCompletados === 0;
    const isInProgress = !isCompleted && topic.pomodorosCompletados > 0;

    // Estilos dinámicos según el estado
    let StatusIcon = Clock;
    let statusText = "En Curso";
    let statusColor = "text-violet-500 border-violet-500/30 bg-violet-500/10";

    if (isCompleted) {
        StatusIcon = CheckCircle2;
        statusText = "Completado";
        statusColor = "text-green-500 border-green-500/30 bg-green-500/10";
    } else if (isPending) {
        StatusIcon = CircleDashed;
        statusText = "Pendiente";
        statusColor = "text-neutral-400 border-neutral-700 bg-neutral-800/50";
    }

    // Cálculo seguro del porcentaje para la barra de progreso
    const progressPercent = topic.pomodorosEstimados > 0
        ? Math.round((topic.pomodorosCompletados / topic.pomodorosEstimados) * 100)
        : 0;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            {/* Contenedor principal del modal */}
            <div className="bg-[#0c0c0c] border border-neutral-800 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col">

                {/* Header */}
                <div className="flex items-start justify-between border-b border-neutral-800 p-6 bg-neutral-900/20">
                    <div>
                        <h2 className="text-[10px] font-mono text-neutral-500 tracking-widest uppercase mb-2">
                            Detalle_Tema
                        </h2>
                        <h3 className="text-lg font-medium text-white leading-tight pr-4">
                            {topic.titulo}
                        </h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-neutral-500 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors flex-shrink-0"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6 flex-grow">
                    {/* Grilla de Información (Módulo y Estado) */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="border border-neutral-800 rounded-xl p-4 bg-neutral-900/30">
                            <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest block mb-1">Módulo</span>
                            <span className="text-sm text-neutral-300 line-clamp-2">{topic.moduloTitulo}</span>
                        </div>
                        <div className={`border rounded-xl p-4 flex flex-col items-start justify-center ${statusColor}`}>
                            <span className="text-[9px] font-mono uppercase tracking-widest block mb-1 opacity-70">Estado</span>
                            <div className="flex items-center gap-2 font-medium">
                                <StatusIcon className="w-4 h-4" />
                                <span className="text-sm">{statusText}</span>
                            </div>
                        </div>
                    </div>

                    {/* Progreso de Pomodoros */}
                    <div className="border border-neutral-800 rounded-xl p-4">
                        <div className="flex justify-between items-end mb-3">
                            <div>
                                <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest block mb-1">Carga_Cognitiva</span>
                                <span className="text-sm text-neutral-300">Pomodoros</span>
                            </div>
                            <div className="text-right">
                                <span className="text-3xl font-light text-white tabular-nums">{topic.pomodorosCompletados}</span>
                                <span className="text-neutral-500 font-mono text-sm">/{topic.pomodorosEstimados}</span>
                            </div>
                        </div>
                        {/* Barra de progreso visual */}
                        <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all duration-500 ${isCompleted ? 'bg-green-500' : 'bg-violet-500'}`}
                                style={{ width: `${Math.min(progressPercent, 100)}%` }}
                            ></div>
                        </div>
                    </div>
                </div>

                {/* Footer / Acciones */}
                <div className="border-t border-neutral-800 p-6 flex gap-3">
                    {/* Solo mostramos el botón de Iniciar si el tema NO está completado */}
                    {!isCompleted && (
                        <button
                            onClick={() => onStartFocus(topic)}
                            className="flex-1 bg-violet-600 hover:bg-violet-500 text-white font-mono text-[10px] tracking-widest uppercase py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-violet-500/20"
                        >
                            <Play className="w-4 h-4 fill-current" />
                            Iniciar_Sesión
                        </button>
                    )}
                    <button
                        onClick={onClose}
                        className={`${isCompleted ? 'flex-1' : 'w-auto px-6'} border border-neutral-700 text-neutral-400 hover:text-white hover:bg-neutral-800 font-mono text-[10px] tracking-widest uppercase py-3 rounded-xl transition-colors text-center`}
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
}
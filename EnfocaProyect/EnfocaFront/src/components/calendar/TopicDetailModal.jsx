// src/components/calendar/TopicDetailModal.jsx
import React from 'react';
import { X, Play } from 'lucide-react';

export default function TopicDetailModal({ isOpen, onClose, topic, onStartFocus }) {
    if (!isOpen || !topic) return null;

    const isCompleted = topic.completado;
    const progressPercent = topic.pomodorosEstimados > 0
        ? Math.round((topic.pomodorosCompletados / topic.pomodorosEstimados) * 100)
        : 0;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-[#0c0c0c] border border-neutral-800 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col">

                {/* Header */}
                <div className="flex items-start justify-between border-b border-neutral-800 p-6 bg-neutral-900/20">
                    <div>
                        <h2 className="text-[10px] font-mono text-neutral-500 tracking-widest uppercase mb-2">Detalle_de_Sesión</h2>
                        <h3 className="text-lg font-medium text-white leading-tight pr-4">{topic.titulo}</h3>
                    </div>
                    <button onClick={onClose} className="p-2 text-neutral-500 hover:text-white bg-neutral-900/50 hover:bg-neutral-800 rounded-lg transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6 flex-grow">

                    {/* Detalles del Progreso (Enviado por el MS de Pomodoro) */}
                    <div className="border border-neutral-800 rounded-xl p-4 bg-black/40">
                        <div className="flex justify-between items-end mb-3">
                            <div>
                                <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest block mb-1">Módulo: {topic.moduloTitulo}</span>
                                <span className="text-sm text-neutral-300">
                                    {isCompleted ? "Completado" : "Progreso actual"}
                                </span>
                            </div>
                            <div className="text-right">
                                <span className="text-3xl font-light text-white tabular-nums">{topic.pomodorosCompletados}</span>
                                <span className="text-neutral-500 font-mono text-sm">/{topic.pomodorosEstimados} Poms</span>
                            </div>
                        </div>
                        <div className="w-full h-2 bg-neutral-900 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full transition-all duration-500 ${isCompleted ? 'bg-green-500' : 'bg-violet-500'}`} style={{ width: `${Math.min(progressPercent, 100)}%` }}></div>
                        </div>
                    </div>

                    {/* Espacio reservado por si en el futuro quieres mostrar la hora exacta en que se trabajó */}
                    <div className="text-center">
                        <span className="text-[10px] font-mono text-neutral-600 uppercase tracking-widest">
                            // Datos provenientes del registro de Pomodoro
                        </span>
                    </div>

                </div>

                {/* Footer Acciones */}
                <div className="border-t border-neutral-800 p-4 flex gap-3 bg-neutral-900/10">
                    {!isCompleted && (
                        <button onClick={() => onStartFocus(topic)} className="flex-1 bg-violet-600 hover:bg-violet-500 text-white font-mono text-[10px] tracking-widest uppercase py-3 rounded-xl flex items-center justify-center gap-2 transition-colors">
                            <Play className="w-4 h-4 fill-current" />
                            {topic.pomodorosCompletados > 0 ? "Retomar_Estudio" : "Iniciar_Estudio"}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
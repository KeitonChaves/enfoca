import React, { useState } from 'react';
import { CheckCircle2, RotateCcw, CalendarDays, X, Loader2 } from 'lucide-react';

export default function SessionEndModal({ isOpen, onClose, topic, onComplete, onSchedule }) {
    const [scheduleMode, setScheduleMode] = useState('none');
    const [selectedDays, setSelectedDays]   = useState([]);
    const [saving, setSaving]               = useState(false);

    if (!isOpen || !topic) return null;

    const daysOfWeek = [
        { id: '1', label: 'L' }, { id: '2', label: 'M' }, { id: '3', label: 'X' },
        { id: '4', label: 'J' }, { id: '5', label: 'V' }, { id: '6', label: 'S' }, { id: '0', label: 'D' },
    ];

    const toggleDay = (dayId) =>
        setSelectedDays(prev =>
            prev.includes(dayId) ? prev.filter(d => d !== dayId) : [...prev, dayId]
        );

    const buildDates = (mode) => {
        if (mode === 'quick') {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            return [tomorrow.toLocaleDateString('sv-SE')]; // YYYY-MM-DD local
        }
        if (mode === 'custom' && selectedDays.length > 0) {
            const dates = [];
            const today = new Date();
            for (let i = 1; i <= 28; i++) {
                const d = new Date(today);
                d.setDate(today.getDate() + i);
                if (selectedDays.includes(String(d.getDay()))) {
                    dates.push(d.toLocaleDateString('sv-SE'));
                }
            }
            return dates;
        }
        return [];
    };

    const handleSchedule = async (mode = scheduleMode) => {
        const dates = buildDates(mode);
        if (!dates.length) return;

        setSaving(true);
        try {
            await onSchedule(dates);
        } catch {
            // el padre maneja errores
        } finally {
            setSaving(false);
        }
    };

    const handleComplete = async () => {
        setSaving(true);
        try {
            await onComplete(topic.id);
        } catch {
            // el padre maneja errores
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-[#0c0c0c] border border-neutral-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col">

                {/* Header */}
                <div className="flex items-start justify-between border-b border-neutral-800 p-6 bg-neutral-900/20">
                    <div>
                        <h2 className="text-[10px] font-mono text-neutral-500 tracking-widest uppercase mb-1">Sesión_Finalizada</h2>
                        <h3 className="text-xl font-medium text-white leading-tight">¡Buen Trabajo!</h3>
                    </div>
                    <button onClick={onClose} disabled={saving} className="p-2 text-neutral-500 hover:text-white transition-colors disabled:opacity-40">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    <div className="text-center">
                        <p className="text-sm text-neutral-400 mb-2">Completaste la sesión para:</p>
                        <p className="text-md text-violet-400 font-medium">{topic.titulo}</p>
                    </div>

                    <div className="border border-neutral-800 rounded-xl p-5 bg-black/40">
                        <p className="text-sm text-white font-medium mb-4 text-center">¿Qué deseas hacer ahora?</p>
                        <div className="flex flex-col gap-3">

                            {/* Marcar completado */}
                            <button
                                onClick={handleComplete}
                                disabled={saving}
                                className="w-full bg-green-600/20 hover:bg-green-600/30 text-green-400 border border-green-500/30 py-3 rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                            >
                                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                                Marcar Tema como Completado
                            </button>

                            {scheduleMode === 'none' && (
                                <>
                                    <div className="relative flex items-center py-2">
                                        <div className="flex-grow border-t border-neutral-800" />
                                        <span className="flex-shrink-0 mx-4 text-neutral-500 text-xs font-mono">O CONTINUAR LUEGO</span>
                                        <div className="flex-grow border-t border-neutral-800" />
                                    </div>
                                    <button
                                        onClick={() => handleSchedule('quick')}
                                        disabled={saving}
                                        className="w-full bg-neutral-800 hover:bg-neutral-700 text-white py-3 rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                                    >
                                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <RotateCcw className="w-4 h-4" />}
                                        Repetir Mañana
                                    </button>
                                    <button
                                        onClick={() => setScheduleMode('custom')}
                                        disabled={saving}
                                        className="w-full bg-neutral-900 border border-neutral-700 hover:border-neutral-600 text-neutral-300 py-3 rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                                    >
                                        <CalendarDays className="w-4 h-4" /> Programar Días Específicos
                                    </button>
                                </>
                            )}

                            {scheduleMode === 'custom' && (
                                <div className="space-y-4">
                                    <p className="text-xs text-neutral-400 text-center">Selecciona los días de repaso:</p>
                                    <div className="flex justify-between gap-1">
                                        {daysOfWeek.map(day => (
                                            <button
                                                key={day.id}
                                                onClick={() => toggleDay(day.id)}
                                                disabled={saving}
                                                className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                                                    selectedDays.includes(day.id)
                                                        ? 'bg-violet-600 text-white'
                                                        : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
                                                }`}
                                            >
                                                {day.label}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setScheduleMode('none')}
                                            disabled={saving}
                                            className="px-4 py-3 rounded-lg border border-neutral-700 text-neutral-400 text-xs hover:text-white transition-all"
                                        >
                                            ← Volver
                                        </button>
                                        <button
                                            onClick={() => handleSchedule('custom')}
                                            disabled={selectedDays.length === 0 || saving}
                                            className="flex-1 bg-violet-600 hover:bg-violet-500 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                                        >
                                            {saving
                                                ? <><Loader2 className="w-4 h-4 animate-spin" /> Guardando...</>
                                                : <>Confirmar Horario</>
                                            }
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

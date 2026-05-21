import React, { useState } from 'react';
import { CheckCircle2, RotateCcw, CalendarDays, X, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';

const DAYS_LABEL = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá', 'Do'];
const MONTHS     = ['Enero','Febrero','Marzo','Abril','Mayo','Junio',
                    'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

function DatePicker({ selectedDates, onChange }) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [viewYear,  setViewYear]  = useState(today.getFullYear());
    const [viewMonth, setViewMonth] = useState(today.getMonth());

    const toKey = (d) => d.toLocaleDateString('sv-SE');

    const firstDay = new Date(viewYear, viewMonth, 1);
    // Offset para empezar en lunes (0=lu, 6=do)
    const startOffset = (firstDay.getDay() + 6) % 7;
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

    const toggleDate = (d) => {
        const key = toKey(d);
        onChange(
            selectedDates.includes(key)
                ? selectedDates.filter(s => s !== key)
                : [...selectedDates, key]
        );
    };

    const prevMonth = () => {
        if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
        else setViewMonth(m => m - 1);
    };
    const nextMonth = () => {
        if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
        else setViewMonth(m => m + 1);
    };

    const cells = [];
    for (let i = 0; i < startOffset; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(viewYear, viewMonth, d));

    return (
        <div className="w-full">
            {/* Navegación mes */}
            <div className="flex items-center justify-between mb-3">
                <button onClick={prevMonth} className="p-1 text-neutral-500 hover:text-white transition-colors rounded">
                    <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-semibold text-white tracking-wider">
                    {MONTHS[viewMonth]} {viewYear}
                </span>
                <button onClick={nextMonth} className="p-1 text-neutral-500 hover:text-white transition-colors rounded">
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>

            {/* Cabecera días */}
            <div className="grid grid-cols-7 mb-1">
                {DAYS_LABEL.map(d => (
                    <div key={d} className="text-center text-[10px] font-semibold text-neutral-600 uppercase py-1">
                        {d}
                    </div>
                ))}
            </div>

            {/* Celdas */}
            <div className="grid grid-cols-7 gap-0.5">
                {cells.map((day, i) => {
                    if (!day) return <div key={`e-${i}`} />;
                    const isPast     = day < today;
                    const isToday    = toKey(day) === toKey(today);
                    const isSelected = selectedDates.includes(toKey(day));
                    return (
                        <button
                            key={toKey(day)}
                            onClick={() => !isPast && toggleDate(day)}
                            disabled={isPast}
                            className={`
                                aspect-square flex items-center justify-center text-xs rounded-lg transition-all
                                ${isPast      ? 'text-neutral-800 cursor-not-allowed' : ''}
                                ${isSelected  ? 'bg-violet-600 text-white font-bold' : ''}
                                ${!isSelected && isToday && !isPast ? 'border border-violet-500/40 text-violet-400' : ''}
                                ${!isSelected && !isPast && !isToday ? 'text-neutral-300 hover:bg-neutral-800' : ''}
                            `}
                        >
                            {day.getDate()}
                        </button>
                    );
                })}
            </div>

            {/* Fechas seleccionadas */}
            {selectedDates.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                    {selectedDates.sort().map(d => (
                        <span key={d} className="flex items-center gap-1 text-[10px] bg-violet-600/20 text-violet-300 px-2 py-0.5 rounded-full">
                            {d}
                            <button onClick={() => onChange(selectedDates.filter(s => s !== d))} className="hover:text-white">×</button>
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
}

export default function SessionEndModal({ isOpen, onClose, topic, onComplete, onSchedule }) {
    const [scheduleMode, setScheduleMode]   = useState('none');
    const [selectedDates, setSelectedDates] = useState([]);
    const [saving, setSaving]               = useState(false);

    if (!isOpen || !topic) return null;

    const handleSchedule = async (dates) => {
        if (!dates?.length) return;
        setSaving(true);
        try {
            await onSchedule(dates);
        } catch (e) {
            console.error('[Modal] error en onSchedule:', e);
        } finally {
            setSaving(false);
        }
    };

    const handleComplete = async () => {
        setSaving(true);
        try {
            await onComplete(topic.id);
        } catch (e) {
            console.error('[Modal] error en onComplete:', e);
        } finally {
            setSaving(false);
        }
    };

    const handleRepetirManana = () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        handleSchedule([tomorrow.toLocaleDateString('sv-SE')]);
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

                <div className="p-6 space-y-5">
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
                                    <div className="relative flex items-center py-1">
                                        <div className="flex-grow border-t border-neutral-800" />
                                        <span className="flex-shrink-0 mx-4 text-neutral-500 text-xs font-mono">O CONTINUAR LUEGO</span>
                                        <div className="flex-grow border-t border-neutral-800" />
                                    </div>
                                    <button
                                        onClick={handleRepetirManana}
                                        disabled={saving}
                                        className="w-full bg-neutral-800 hover:bg-neutral-700 text-white py-3 rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                                    >
                                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <RotateCcw className="w-4 h-4" />}
                                        Repetir Mañana
                                    </button>
                                    <button
                                        onClick={() => setScheduleMode('calendar')}
                                        disabled={saving}
                                        className="w-full bg-neutral-900 border border-neutral-700 hover:border-violet-500/40 hover:bg-violet-600/5 text-neutral-300 py-3 rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                                    >
                                        <CalendarDays className="w-4 h-4 text-violet-400" />
                                        Programar en Calendario
                                    </button>
                                </>
                            )}

                            {scheduleMode === 'calendar' && (
                                <div className="flex flex-col gap-4">
                                    <DatePicker
                                        selectedDates={selectedDates}
                                        onChange={setSelectedDates}
                                    />
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => { setScheduleMode('none'); setSelectedDates([]); }}
                                            disabled={saving}
                                            className="px-4 py-2.5 rounded-lg border border-neutral-700 text-neutral-400 text-xs hover:text-white transition-all"
                                        >
                                            ← Volver
                                        </button>
                                        <button
                                            onClick={() => handleSchedule(selectedDates)}
                                            disabled={selectedDates.length === 0 || saving}
                                            className="flex-1 bg-violet-600 hover:bg-violet-500 text-white py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed text-sm"
                                        >
                                            {saving
                                                ? <><Loader2 className="w-4 h-4 animate-spin" /> Guardando...</>
                                                : <><CalendarDays className="w-4 h-4" /> Confirmar {selectedDates.length > 0 ? `(${selectedDates.length})` : ''}</>
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

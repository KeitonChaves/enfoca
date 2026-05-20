// src/pages/WeeklyCalendarPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWeeklyCalendar } from '../hooks/useWeeklyCalendar';
import WeekSelector from '../components/calendar/WeekSelector';
import WeeklyGrid from '../components/calendar/WeeklyGrid';
import WeeklySummarySidebar from '../components/calendar/WeeklySummarySidebar';
import MonthView from '../components/calendar/MonthView';
import DetailedDayView from '../components/calendar/DetailedDayView';
import TopicDetailModal from '../components/calendar/TopicDetailModal'; // <-- Importamos el Modal

export default function WeeklyCalendarPage() {
    const navigate = useNavigate();

    // Función auxiliar para extraer el formato YYYY-MM-DD respetando la zona horaria local
    const formatearFechaLocal = (fecha) => {
        const year = fecha.getFullYear();
        const month = String(fecha.getMonth() + 1).padStart(2, '0');
        const day = String(fecha.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // Estados para controlar la vista actual
    const [currentView, setCurrentView] = useState('month');
    const [selectedDayStr, setSelectedDayStr] = useState(formatearFechaLocal(new Date()));

    // Estados para el Modal de Detalles
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTopic, setSelectedTopic] = useState(null);

    const {
        baseDate,
        setBaseDate,
        weekData,
        isLoading,
        error,
        changeWeek,
        changeMonth,
        goToCurrentWeek
    } = useWeeklyCalendar();

    // 1. Abre el modal al hacer clic en la tarjeta (en cualquier vista)
    const handleOpenModal = (topic) => {
        setSelectedTopic(topic);
        setIsModalOpen(true);
    };

    // 2. Redirige al timer de Pomodoro (desde el modal o el botón Play rápido)
    const handleStartFocus = (topic) => {
        setIsModalOpen(false);
        navigate('/pomodoro', { state: { targetTopic: topic } });
    };

    // 3. Maneja la reprogramación de la fecha
    const handleMoveDate = (topic, newDateStr) => {
        console.log(`[API Mock] Moviendo tema "${topic.titulo}" al día ${newDateStr}`);
        // TODO: Aquí irá la llamada a tu backend: planService.reprogramar(topic.id, newDateStr)
        // Y luego puedes recargar los datos: refreshData()
    };

    // Al hacer clic en un día (desde el mes o semana), cambiamos a la vista de "Día"
    const handleDaySelect = (fechaStr) => {
        setSelectedDayStr(fechaStr);
        // CORRECCIÓN: Reemplazamos los guiones por barras para que JS lo interprete como hora local
        const fechaLocal = new Date(fechaStr.replace(/-/g, '\/'));
        setBaseDate(fechaLocal);
        setCurrentView('day');
    };

    // Extraemos los datos del día seleccionado para la vista detallada
    const activeDayData = weekData?.dias?.find(d => d.fecha === selectedDayStr) ||
        weekData?.mesDias?.find(d => d.fecha === selectedDayStr) ||
        { fecha: selectedDayStr, temas: [] };

    // Controladores dinámicos para los botones de siguiente/anterior
    const handleNext = () => {
        if (currentView === 'month') {
            changeMonth(1);
        } else if (currentView === 'week') {
            changeWeek(7);
        } else {
            // En vista de día avanza 1 día de forma segura
            const nextDay = new Date(baseDate);
            nextDay.setDate(baseDate.getDate() + 1);
            setBaseDate(nextDay);
            setSelectedDayStr(formatearFechaLocal(nextDay));
        }
    };

    const handlePrevious = () => {
        if (currentView === 'month') {
            changeMonth(-1);
        } else if (currentView === 'week') {
            changeWeek(-7);
        } else {
            // En vista de día retrocede 1 día de forma segura
            const prevDay = new Date(baseDate);
            prevDay.setDate(baseDate.getDate() - 1);
            setBaseDate(prevDay);
            setSelectedDayStr(formatearFechaLocal(prevDay));
        }
    };

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-[#0a0a0a] text-neutral-900 dark:text-white p-4 md:p-6 lg:p-8 relative">

            {/* Cabecera y Navegación Principal */}
            <header className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-neutral-200 dark:border-neutral-800 pb-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight mb-1">Mi Planificación</h1>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        Organiza tus temas de estudio y haz seguimiento a tu progreso.
                    </p>
                </div>

                <div className="flex flex-col items-end gap-3">
                    {/* MINI NAVBAR DE VISTAS */}
                    <div className="flex bg-white dark:bg-[#0c0c0c] border border-neutral-200 dark:border-neutral-800 p-1 rounded-lg font-mono text-[16px] tracking-widest uppercase shadow-sm">
                        {[
                            { id: 'month', label: 'Mes' },
                            { id: 'week', label: 'Semana' },
                            { id: 'day', label: 'Día' }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setCurrentView(tab.id)}
                                className={`px-4 py-2 rounded-md transition-all ${
                                    currentView === tab.id
                                        ? 'bg-violet-600 text-white shadow-md'
                                        : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Selector de Fechas Dinámico */}
                    <WeekSelector
                        view={currentView}
                        baseDate={baseDate}
                        onNext={handleNext}
                        onPrevious={handlePrevious}
                        onToday={goToCurrentWeek}
                    />
                </div>
            </header>

            {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-xl mb-6">
                    {error?.message || 'Error al cargar el calendario. Verifica que los servicios estén activos.'}
                </div>
            )}

            {/* Layout Principal: Contenido Dinámico + Sidebar */}
            <div className="flex flex-col lg:flex-row gap-6 items-stretch flex-grow">

                <div className="flex-grow w-full overflow-hidden">
                    {isLoading ? (
                        <div className="h-[500px] flex items-center justify-center border border-neutral-200 dark:border-neutral-800 rounded-2xl bg-white dark:bg-[#0c0c0c]">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500"></div>
                        </div>
                    ) : (
                        // Renderizado condicional basado en el mini-navbar
                        <>
                            {currentView === 'month' && (
                                <MonthView
                                    days={weekData?.mesDias || []}
                                    onDayClick={handleDaySelect}
                                    onTopicClick={handleOpenModal}
                                />
                            )}
                            {currentView === 'week' && (
                                <WeeklyGrid
                                    days={weekData?.dias || []}
                                    onDayClick={handleDaySelect}
                                    onTopicClick={handleOpenModal}
                                    onStartFocus={handleStartFocus} // <-- Pasamos el botón de Play rápido
                                />
                            )}
                            {currentView === 'day' && (
                                <DetailedDayView
                                    dayData={activeDayData}
                                    onTopicClick={handleOpenModal}
                                />
                            )}
                        </>
                    )}
                </div>

                <div className="lg:w-80 h-full flex-shrink-0">
                    <WeeklySummarySidebar summary={weekData?.resumen} isLoading={isLoading} />
                </div>

            </div>

            {/* MODAL DE DETALLE Y REPROGRAMACIÓN */}
            <TopicDetailModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                topic={selectedTopic}
                onStartFocus={handleStartFocus}
                onMoveDate={handleMoveDate}
            />
        </div>
    );
}
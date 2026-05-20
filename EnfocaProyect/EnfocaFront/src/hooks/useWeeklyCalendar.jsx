import { useState, useEffect, useCallback } from 'react';
import { calendarService } from '../services/calendarService';

export const useWeeklyCalendar = () => {
    const [baseDate, setBaseDate]   = useState(new Date());
    const [weekData, setWeekData]   = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError]         = useState(null);

    const formatDate = (date) => {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    };

    const getStartOfWeek = (date) => {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1);
        return new Date(d.setDate(diff));
    };

    // Genera los 7 días de la semana actual mezclados con datos de la API
    const buildWeekDays = useCallback((apiDias) => {
        const start = getStartOfWeek(baseDate);
        return Array.from({ length: 7 }, (_, i) => {
            const day = new Date(start);
            day.setDate(start.getDate() + i);
            const dateStr = formatDate(day);
            const found = apiDias?.find(d => d.fecha === dateStr);
            return { fecha: dateStr, temas: found?.temas ?? [] };
        });
    }, [baseDate]);

    // Genera todas las celdas del mes mezcladas con datos de la API
    const buildMonthDays = useCallback((apiDias) => {
        const year  = baseDate.getFullYear();
        const month = baseDate.getMonth();
        const first = new Date(year, month, 1);
        const last  = new Date(year, month + 1, 0);
        const startOffset = first.getDay() === 0 ? 6 : first.getDay() - 1;
        const days = [];

        for (let i = 0; i < startOffset; i++) days.push({ padding: true });

        for (let i = 1; i <= last.getDate(); i++) {
            const dateStr = formatDate(new Date(year, month, i));
            const found = apiDias?.find(d => d.fecha === dateStr);
            days.push({ fecha: dateStr, dayNumber: i, temas: found?.temas ?? [] });
        }
        return days;
    }, [baseDate]);

    const loadData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            // Consultar el mes completo — cubre tanto la vista semana como la vista mes
            const year  = baseDate.getFullYear();
            const month = baseDate.getMonth();
            const fechaInicio = formatDate(new Date(year, month, 1));
            const fechaFin    = formatDate(new Date(year, month + 1, 0));

            const { data } = await calendarService.obtenerCalendario(fechaInicio, fechaFin);

            const completados = data.reduce((acc, d) => acc + d.temas.filter(t => t.completado).length, 0);
            const total       = data.reduce((acc, d) => acc + d.temas.length, 0);

            setWeekData({
                resumen: {
                    totalTemas: total,
                    temasCompletados: completados,
                    porcentajeAvance: total > 0 ? Math.round((completados / total) * 100) : 0,
                },
                dias:    buildWeekDays(data),
                mesDias: buildMonthDays(data),
            });
        } catch (err) {
            setError(err);
            setWeekData({
                resumen: { totalTemas: 0, temasCompletados: 0, porcentajeAvance: 0 },
                dias:    buildWeekDays([]),
                mesDias: buildMonthDays([]),
            });
        } finally {
            setIsLoading(false);
        }
    }, [baseDate, buildWeekDays, buildMonthDays]);

    useEffect(() => { loadData(); }, [loadData]);

    return {
        baseDate,
        setBaseDate,
        weekData,
        isLoading,
        error,
        changeWeek:      (n) => { const d = new Date(baseDate); d.setDate(d.getDate() + n); setBaseDate(d); },
        changeMonth:     (n) => { const d = new Date(baseDate); d.setMonth(d.getMonth() + n); setBaseDate(d); },
        goToCurrentWeek: ()  => setBaseDate(new Date()),
        refresh:         ()  => loadData(),
    };
};

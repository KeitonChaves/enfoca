// src/hooks/useWeeklyCalendar.js
import { useState, useEffect, useCallback } from 'react';

export const useWeeklyCalendar = () => {
    const [baseDate, setBaseDate] = useState(new Date());
    const [weekData, setWeekData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const getStartOfWeek = (date) => {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1);
        return new Date(d.setDate(diff));
    };

    // CORRECCIÓN CLAVE: Formatear a YYYY-MM-DD usando métodos locales, NO toISOString()
    const formatDateForApi = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const generateFullWeek = useCallback((apiDays) => {
        const start = getStartOfWeek(baseDate);
        const fullWeek = [];

        for (let i = 0; i < 7; i++) {
            const currentDay = new Date(start);
            currentDay.setDate(start.getDate() + i);
            const dateStr = formatDateForApi(currentDay);

            const existingDayData = apiDays?.find(d => d.fecha === dateStr);

            fullWeek.push({
                fecha: dateStr,
                temas: existingDayData ? existingDayData.temas : []
            });
        }
        return fullWeek;
    }, [baseDate]);

    const generateFullMonth = useCallback(() => {
        const year = baseDate.getFullYear();
        const month = baseDate.getMonth();
        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0);

        const startOffset = firstDayOfMonth.getDay() === 0 ? 6 : firstDayOfMonth.getDay() - 1;
        const totalDays = lastDayOfMonth.getDate();

        const fullMonthDays = [];

        for (let i = 0; i < startOffset; i++) {
            fullMonthDays.push({ padding: true });
        }

        for (let i = 1; i <= totalDays; i++) {
            const currentDay = new Date(year, month, i);
            const dateStr = formatDateForApi(currentDay); // Ahora el string coincidirá con el 'i'

            fullMonthDays.push({
                fecha: dateStr,
                dayNumber: i,
                temas: currentDay.getDate() === 15 ? [
                    { id: 101, titulo: "Database Normalization", color: "#8b5cf6", completado: false, pomodorosCompletados: 1, pomodorosEstimados: 3, moduloTitulo: "Backend Eng" }
                ] : []
            });
        }

        return fullMonthDays;
    }, [baseDate]);

    const loadWeekData = useCallback(() => {
        setIsLoading(true);
        setTimeout(() => {
            const hoy = new Date();
            const apiDaysResponse = [
                {
                    fecha: formatDateForApi(hoy),
                    temas: [
                        { id: 1, titulo: "Ciclo de vida en React", moduloTitulo: "Frontend Core", completado: false, pomodorosCompletados: 2, pomodorosEstimados: 4, color: "#8b5cf6" },
                        { id: 2, titulo: "Configuración de Axios", moduloTitulo: "API Integration", completado: true, pomodorosCompletados: 2, pomodorosEstimados: 2, color: "#ec4899" }
                    ]
                }
            ];

            setWeekData({
                resumen: { totalTemas: 12, temasCompletados: 4, porcentajeAvance: 33, horasPlanificadas: 8.5 },
                dias: generateFullWeek(apiDaysResponse),
                mesDias: generateFullMonth()
            });
            setIsLoading(false);
        }, 300);
    }, [baseDate, generateFullWeek, generateFullMonth]);

    useEffect(() => {
        loadWeekData();
    }, [loadWeekData]);

    const changeWeek = (amount) => {
        const next = new Date(baseDate);
        next.setDate(next.getDate() + amount);
        setBaseDate(next);
    };

    const changeMonth = (amount) => {
        const next = new Date(baseDate);
        next.setMonth(next.getMonth() + amount);
        setBaseDate(next);
    };

    return {
        baseDate,
        setBaseDate,
        weekData,
        isLoading,
        changeWeek,
        changeMonth,
        goToCurrentWeek: () => setBaseDate(new Date())
    };
};
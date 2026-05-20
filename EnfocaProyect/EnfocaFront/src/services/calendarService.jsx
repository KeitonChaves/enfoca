import api from './api';

export const calendarService = {
    obtenerCalendario: (fechaInicio, fechaFin) =>
        api.get('/planes-estudio/programacion', { params: { fechaInicio, fechaFin } }),
};

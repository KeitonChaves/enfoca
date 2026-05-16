import clienteHttp from './clienteHttp'; // Ajusta la ruta según la ubicación real de tu cliente Axios

export const fetchWeeklyCalendar = async (fechaInicio, fechaFin) => {
    try {
        const response = await clienteHttp.get('/calendario/semana', {
            params: { fechaInicio, fechaFin }
        });
        return response.data;
    } catch (error) {
        console.error("Error al obtener el calendario semanal:", error);
        throw error;
    }
};
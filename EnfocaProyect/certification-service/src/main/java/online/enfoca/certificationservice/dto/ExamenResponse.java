package online.enfoca.certificationservice.dto;

import online.enfoca.certificationservice.dominio.Examen;
import online.enfoca.certificationservice.dominio.PreguntaExamen;
import online.enfoca.certificationservice.enums.EstadoExamen;

import java.util.List;
import java.util.UUID;

public record ExamenResponse(
        UUID id,
        String planTitulo,
        int intento,
        EstadoExamen estado,
        List<PreguntaDTO> preguntas
) {
    public record PreguntaDTO(
            UUID id,
            int orden,
            String texto,
            List<String> opciones
    ) {}

    public static ExamenResponse desde(Examen examen, List<String> opcionesParsed) {
        // Delegamos el parseo de opciones al servicio
        return null; // ver ServicioCertificacion.toResponse()
    }
}

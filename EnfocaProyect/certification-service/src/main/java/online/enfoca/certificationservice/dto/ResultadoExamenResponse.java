package online.enfoca.certificationservice.dto;

import online.enfoca.certificationservice.enums.EstadoExamen;

import java.util.List;
import java.util.UUID;

public record ResultadoExamenResponse(
        UUID examenId,
        EstadoExamen estado,
        int puntaje,
        int total,
        boolean aprobado,
        int intentosRestantes,
        List<String> temasARepasar,     // solo si reprobó
        UUID certificadoId,             // solo si aprobó
        UUID codigoVerificacion         // solo si aprobó
) {}

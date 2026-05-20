package online.enfoca.aiservice.dto;

import java.util.UUID;

public record TemaCalendarioDTO(
        UUID id,
        String titulo,
        String moduloTitulo,
        String planTitulo,
        boolean completado,
        int pomodorosCompletados,
        int pomodorosEstimados
) {}

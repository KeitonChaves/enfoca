package online.enfoca.aiservice.dto;

import java.util.UUID;

public record ToggleTemaResponse(
        TemaResponse tema,
        boolean moduloCompletado,
        UUID moduloId,
        String moduloTitulo
) {}

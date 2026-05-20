package online.enfoca.aiservice.dto;

import java.util.List;
import java.util.UUID;

public record CuestionarioResponse(
        UUID moduloId,
        String moduloTitulo,
        List<PreguntaDTO> preguntas
) {
    public record PreguntaDTO(
            String texto,
            List<String> opciones,
            int respuestaCorrecta,
            String explicacion
    ) {}
}

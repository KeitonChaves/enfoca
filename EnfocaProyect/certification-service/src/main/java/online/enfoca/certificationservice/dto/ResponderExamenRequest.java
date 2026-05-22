package online.enfoca.certificationservice.dto;

import jakarta.validation.constraints.NotNull;

import java.util.Map;
import java.util.UUID;

public record ResponderExamenRequest(
        @NotNull Map<UUID, Integer> respuestas  // preguntaExamenId -> índice opción elegida
) {}

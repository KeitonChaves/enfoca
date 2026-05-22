package online.enfoca.aiservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record FeedbackRequest(

        @NotBlank(message = "El motivo es obligatorio")
        String motivo,

        @Size(max = 500, message = "El detalle no puede superar 500 caracteres")
        String detalle
) {}

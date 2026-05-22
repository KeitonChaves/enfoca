package online.enfoca.certificationservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.List;
import java.util.UUID;

public record IniciarExamenRequest(
        @NotNull UUID planMaestroId,
        @NotBlank String planTitulo,
        List<ModuloDTO> modulos
) {
    public record ModuloDTO(String titulo, List<String> temas) {}
}

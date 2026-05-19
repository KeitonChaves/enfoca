package online.enfoca.aiservice.dto;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.List;

public record ProgramarTemaRequest(
        @NotNull(message = "La lista de fechas no puede ser nula")
        List<LocalDate> fechas
) {}
package online.enfoca.aiservice.dto;

import java.util.List;

public record ProgramacionCalendarioDTO(
        String fecha,
        List<TemaCalendarioDTO> temas
) {}

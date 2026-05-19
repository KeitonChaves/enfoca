package online.enfoca.aiservice.repositorio;

import online.enfoca.aiservice.dominio.Programacion;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface ProgramacionRepositorio extends JpaRepository<Programacion, UUID> {
    void deleteByTemaId(UUID temaId);
}

package online.enfoca.certificationservice.repositorio;

import online.enfoca.certificationservice.dominio.Examen;
import online.enfoca.certificationservice.enums.EstadoExamen;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ExamenRepositorio extends JpaRepository<Examen, UUID> {

    int countByUsuarioIdAndPlanMaestroId(String usuarioId, UUID planMaestroId);

    boolean existsByUsuarioIdAndPlanMaestroIdAndEstado(
            String usuarioId, UUID planMaestroId, EstadoExamen estado);

    Optional<Examen> findByUsuarioIdAndPlanMaestroIdAndEstado(
            String usuarioId, UUID planMaestroId, EstadoExamen estado);

    List<Examen> findByUsuarioIdOrderByCreadoEnDesc(String usuarioId);
}

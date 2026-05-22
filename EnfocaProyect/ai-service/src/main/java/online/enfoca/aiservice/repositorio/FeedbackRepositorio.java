package online.enfoca.aiservice.repositorio;

import online.enfoca.aiservice.dominio.FeedbackPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface FeedbackRepositorio extends JpaRepository<FeedbackPlan, UUID> {

    boolean existsByPlanMaestroIdAndUsuarioId(UUID planMaestroId, String usuarioId);

    long countByPlanMaestroId(UUID planMaestroId);

    // Cuenta cuántos usuarios reportaron el mismo motivo
    @Query("SELECT COUNT(f) FROM FeedbackPlan f WHERE f.planMaestroId = :id AND f.motivo = :motivo")
    long countByPlanMaestroIdAndMotivo(@Param("id") UUID planMaestroId, @Param("motivo") String motivo);

    // Obtiene todos los detalles escritos por los usuarios para enriquecer el prompt de mejora
    @Query("SELECT f.motivo, f.detalle FROM FeedbackPlan f WHERE f.planMaestroId = :id ORDER BY f.creadoEn DESC")
    List<Object[]> findMotivoYDetalleByPlanMaestroId(@Param("id") UUID planMaestroId);
}

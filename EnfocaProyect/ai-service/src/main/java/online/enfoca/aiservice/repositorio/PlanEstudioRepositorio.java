package online.enfoca.aiservice.repositorio;

import online.enfoca.aiservice.dominio.PlanEstudio;
import online.enfoca.aiservice.enums.EstadoPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface PlanEstudioRepositorio extends JpaRepository<PlanEstudio, UUID> {

    List<PlanEstudio> findByUsuarioIdOrderByCreadoEnDesc(String usuarioId);

    long countByUsuarioId(String usuarioId);

    List<PlanEstudio> findByEstadoOrderByCreadoEnDesc(EstadoPlan estado);

    @Query("""
            SELECT p FROM PlanEstudio p
            WHERE p.estado IN ('ACTIVO', 'EN_REVISION')
            AND p.totalValidaciones >= :umbral
            """)
    List<PlanEstudio> findParaAutoIndexado(@Param("umbral") int umbral);

    // Busca plan maestro por título similar (sin clonar), prioriza CONGELADO
    @Query("""
            SELECT p FROM PlanEstudio p
            WHERE LOWER(p.titulo) LIKE LOWER(CONCAT('%', :keyword, '%'))
            AND p.originalPlanId IS NULL
            AND p.estado IN ('CONGELADO', 'EN_REVISION', 'ACTIVO')
            ORDER BY
              CASE p.estado WHEN 'CONGELADO' THEN 0 WHEN 'EN_REVISION' THEN 1 ELSE 2 END ASC,
              p.totalValidaciones DESC
            """)
    List<PlanEstudio> findMaestrosPorKeyword(@Param("keyword") String keyword);

    // Planes en revisión que el usuario aún no ha valorado y no son suyos
    @Query("""
            SELECT p FROM PlanEstudio p
            WHERE p.estado = 'EN_REVISION'
            AND p.originalPlanId IS NULL
            AND p.usuarioId <> :usuarioId
            AND NOT EXISTS (
                SELECT v FROM Validacion v WHERE v.plan = p AND v.usuarioId = :usuarioId
            )
            ORDER BY p.totalValidaciones DESC
            """)
    List<PlanEstudio> findEnRevisionParaUsuario(@Param("usuarioId") String usuarioId);
}

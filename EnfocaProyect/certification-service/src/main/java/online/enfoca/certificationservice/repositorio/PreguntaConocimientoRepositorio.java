package online.enfoca.certificationservice.repositorio;

import online.enfoca.certificationservice.dominio.PreguntaConocimiento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface PreguntaConocimientoRepositorio extends JpaRepository<PreguntaConocimiento, UUID> {

    long countByPlanMaestroId(UUID planMaestroId);

    // 10 preguntas aleatorias del pool, priorizando las menos usadas
    @Query(value = """
            SELECT * FROM certificacion.pregunta_conocimiento
            WHERE plan_maestro_id = :planId
            ORDER BY veces_usada ASC, RANDOM()
            LIMIT 10
            """, nativeQuery = true)
    List<PreguntaConocimiento> findDiezAleatorias(@Param("planId") UUID planMaestroId);

    // Preguntas que el usuario respondió MAL en su último examen (para reintento)
    @Query(value = """
            SELECT pc.* FROM certificacion.pregunta_conocimiento pc
            INNER JOIN certificacion.pregunta_examen pe ON pe.pregunta_id = pc.id
            INNER JOIN certificacion.examen e ON pe.examen_id = e.id
            WHERE e.usuario_id = :usuarioId
              AND e.plan_maestro_id = :planId
              AND e.estado = 'REPROBADO'
              AND pe.correcta = false
            ORDER BY e.creado_en DESC
            LIMIT :limite
            """, nativeQuery = true)
    List<PreguntaConocimiento> findIncorrectasPrevias(
            @Param("usuarioId") String usuarioId,
            @Param("planId") UUID planMaestroId,
            @Param("limite") int limite);

    // Preguntas nuevas: del pool excluyendo las que ya vio el usuario
    @Query(value = """
            SELECT * FROM certificacion.pregunta_conocimiento
            WHERE plan_maestro_id = :planId
              AND id NOT IN (
                  SELECT pe.pregunta_id FROM certificacion.pregunta_examen pe
                  INNER JOIN certificacion.examen e ON pe.examen_id = e.id
                  WHERE e.usuario_id = :usuarioId
                    AND e.plan_maestro_id = :planId
              )
            ORDER BY veces_usada ASC, RANDOM()
            LIMIT :limite
            """, nativeQuery = true)
    List<PreguntaConocimiento> findNuevasNoVistas(
            @Param("usuarioId") String usuarioId,
            @Param("planId") UUID planMaestroId,
            @Param("limite") int limite);

    // Para detectar en qué módulos/temas el usuario falló
    @Query("""
            SELECT p.moduloTitulo, p.temaTitulo
            FROM PreguntaConocimiento p
            WHERE p.id IN :ids
            """)
    List<Object[]> findModuloYTemaPorIds(@Param("ids") List<UUID> preguntaIds);
}

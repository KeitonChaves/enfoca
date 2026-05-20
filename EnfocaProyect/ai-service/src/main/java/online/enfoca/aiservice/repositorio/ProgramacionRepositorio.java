package online.enfoca.aiservice.repositorio;

import online.enfoca.aiservice.dominio.Programacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface ProgramacionRepositorio extends JpaRepository<Programacion, UUID> {

    void deleteByTemaId(UUID temaId);

    @Query("SELECT p FROM Programacion p " +
           "JOIN FETCH p.tema t JOIN FETCH t.modulo m JOIN FETCH m.plan pl " +
           "WHERE pl.usuarioId = :usuarioId " +
           "AND p.fecha BETWEEN :fechaInicio AND :fechaFin " +
           "ORDER BY p.fecha ASC")
    List<Programacion> findByUsuarioIdAndFechaBetween(
            @Param("usuarioId") String usuarioId,
            @Param("fechaInicio") LocalDate fechaInicio,
            @Param("fechaFin") LocalDate fechaFin);

    @Query("SELECT CASE WHEN COUNT(p) > 0 THEN true ELSE false END " +
           "FROM Programacion p WHERE p.tema.id = :temaId AND p.fecha = :fecha")
    boolean existsByTemaIdAndFecha(@Param("temaId") UUID temaId, @Param("fecha") LocalDate fecha);
}

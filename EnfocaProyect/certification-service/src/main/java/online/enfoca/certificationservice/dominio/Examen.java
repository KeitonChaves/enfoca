package online.enfoca.certificationservice.dominio;

import jakarta.persistence.*;
import lombok.*;
import online.enfoca.certificationservice.enums.EstadoExamen;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "examen", schema = "certificacion")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Examen {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "usuario_id", nullable = false, length = 50)
    private String usuarioId;

    @Column(name = "plan_maestro_id", nullable = false)
    private UUID planMaestroId;

    @Column(name = "plan_titulo", nullable = false)
    private String planTitulo;

    @Column(nullable = false)
    @Builder.Default
    private int intento = 1;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private EstadoExamen estado = EstadoExamen.EN_CURSO;

    @Column(nullable = false)
    @Builder.Default
    private int puntaje = 0;

    @CreationTimestamp
    @Column(name = "creado_en", nullable = false, updatable = false)
    private LocalDateTime creadoEn;

    @Column(name = "finalizado_en")
    private LocalDateTime finalizadoEn;

    @OneToMany(mappedBy = "examen", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @OrderBy("orden ASC")
    @Builder.Default
    private List<PreguntaExamen> preguntas = new ArrayList<>();
}

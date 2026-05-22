package online.enfoca.certificationservice.dominio;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "pregunta_examen", schema = "certificacion")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PreguntaExamen {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "examen_id", nullable = false)
    private Examen examen;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "pregunta_id", nullable = false)
    private PreguntaConocimiento pregunta;

    @Column(nullable = false)
    private int orden;

    @Column(name = "respuesta_usuario")
    private Integer respuestaUsuario;

    @Column(nullable = false)
    @Builder.Default
    private boolean correcta = false;
}

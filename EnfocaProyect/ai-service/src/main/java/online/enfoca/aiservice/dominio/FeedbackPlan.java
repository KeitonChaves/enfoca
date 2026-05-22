package online.enfoca.aiservice.dominio;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "feedback_plan", schema = "planes",
        uniqueConstraints = @UniqueConstraint(columnNames = {"plan_maestro_id", "usuario_id"}))
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class FeedbackPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "plan_maestro_id", nullable = false)
    private UUID planMaestroId;

    @Column(name = "usuario_id", nullable = false, length = 50)
    private String usuarioId;

    @Column(nullable = false, length = 30)
    private String motivo;

    @Column(columnDefinition = "TEXT")
    private String detalle;

    @CreationTimestamp
    @Column(name = "creado_en", nullable = false, updatable = false)
    private LocalDateTime creadoEn;
}

package online.enfoca.aiservice.dominio;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "programacion", schema = "planes",
        uniqueConstraints = @UniqueConstraint(columnNames = {"tema_id", "fecha"}))
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Programacion {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tema_id", nullable = false)
    private Tema tema;

    @Column(nullable = false)
    private LocalDate fecha;

    @CreationTimestamp
    @Column(name = "creado_en", nullable = false, updatable = false)
    private LocalDateTime creadoEn;
}
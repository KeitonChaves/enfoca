package online.enfoca.certificationservice.dominio;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "certificado", schema = "certificacion")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Certificado {

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
    private int puntaje;

    @Column(name = "codigo_verificacion", nullable = false, unique = true)
    @Builder.Default
    private UUID codigoVerificacion = UUID.randomUUID();

    @CreationTimestamp
    @Column(name = "emitido_en", nullable = false, updatable = false)
    private LocalDateTime emitidoEn;
}

package online.enfoca.certificationservice.dominio;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "pregunta_conocimiento", schema = "certificacion")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PreguntaConocimiento {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "plan_maestro_id", nullable = false)
    private UUID planMaestroId;

    @Column(name = "modulo_titulo", nullable = false)
    private String moduloTitulo;

    @Column(name = "tema_titulo")
    private String temaTitulo;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String texto;

    // JSON array: ["opcion A", "opcion B", "opcion C", "opcion D"]
    @Column(nullable = false, columnDefinition = "TEXT")
    private String opciones;

    @Column(name = "respuesta_correcta", nullable = false)
    private int respuestaCorrecta;

    @Column(columnDefinition = "TEXT")
    private String explicacion;

    @Column(name = "veces_usada", nullable = false)
    @Builder.Default
    private int vecesUsada = 0;

    @CreationTimestamp
    @Column(name = "creada_en", nullable = false, updatable = false)
    private LocalDateTime creadaEn;
}

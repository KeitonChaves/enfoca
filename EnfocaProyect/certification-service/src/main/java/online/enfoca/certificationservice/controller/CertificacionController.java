package online.enfoca.certificationservice.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import online.enfoca.certificationservice.dominio.Certificado;
import online.enfoca.certificationservice.dto.*;
import online.enfoca.certificationservice.servicio.ServicioCertificacion;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/certificacion")
@RequiredArgsConstructor
public class CertificacionController {

    private final ServicioCertificacion servicio;

    // Iniciar examen (requiere X-User-Id del gateway)
    @PostMapping("/examenes/iniciar")
    public ResponseEntity<ExamenResponse> iniciar(
            @RequestHeader("X-User-Id") String usuarioId,
            @Valid @RequestBody IniciarExamenRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(servicio.iniciarExamen(usuarioId, request));
    }

    // Responder y calificar examen
    @PostMapping("/examenes/{id}/responder")
    public ResponseEntity<ResultadoExamenResponse> responder(
            @PathVariable UUID id,
            @RequestHeader("X-User-Id") String usuarioId,
            @Valid @RequestBody ResponderExamenRequest request) {
        return ResponseEntity.ok(servicio.responderExamen(id, usuarioId, request));
    }

    // Listar certificados del usuario
    @GetMapping("/certificados")
    public ResponseEntity<List<Certificado>> listar(
            @RequestHeader("X-User-Id") String usuarioId) {
        return ResponseEntity.ok(servicio.listarCertificados(usuarioId));
    }

    // Verificación pública de certificado (para QR)
    @GetMapping("/verificar/{codigo}")
    public ResponseEntity<Certificado> verificar(@PathVariable UUID codigo) {
        return servicio.verificar(codigo)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}

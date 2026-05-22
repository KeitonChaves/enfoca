package online.enfoca.certificationservice.servicio;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import online.enfoca.certificationservice.dominio.*;
import online.enfoca.certificationservice.dto.*;
import online.enfoca.certificationservice.enums.EstadoExamen;
import online.enfoca.certificationservice.ia.ClienteGroqCert;
import online.enfoca.certificationservice.repositorio.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ServicioCertificacion {

    private static final Logger log = LoggerFactory.getLogger(ServicioCertificacion.class);
    private static final int PREGUNTAS_EXAMEN   = 10;
    private static final int MINIMO_APROBACION  = 7;
    private static final int MAX_INTENTOS       = 2;
    private static final int MIN_POOL           = 25;

    private final PreguntaConocimientoRepositorio preguntaRepo;
    private final ExamenRepositorio               examenRepo;
    private final CertificadoRepositorio          certificadoRepo;
    private final ClienteGroqCert                 groq;
    private final ObjectMapper                    objectMapper;

    // ── Iniciar examen ───────────────────────────────────────────────

    @Transactional
    public ExamenResponse iniciarExamen(String usuarioId, IniciarExamenRequest request) {
        UUID planMaestroId = request.planMaestroId();

        // Verificar si ya tiene certificado
        if (certificadoRepo.existsByUsuarioIdAndPlanMaestroId(usuarioId, planMaestroId)) {
            throw new IllegalStateException("Ya obtuviste el certificado para este plan.");
        }

        // Contar intentos usados
        int intentosUsados = examenRepo.countByUsuarioIdAndPlanMaestroId(usuarioId, planMaestroId);
        if (intentosUsados >= MAX_INTENTOS) {
            throw new IllegalStateException(
                    "Agotaste los " + MAX_INTENTOS + " intentos para este plan. Repasa los temas indicados e intenta con un nuevo plan.");
        }

        // Verificar si hay examen en curso
        if (examenRepo.existsByUsuarioIdAndPlanMaestroIdAndEstado(usuarioId, planMaestroId, EstadoExamen.EN_CURSO)) {
            Examen enCurso = examenRepo.findByUsuarioIdAndPlanMaestroIdAndEstado(
                    usuarioId, planMaestroId, EstadoExamen.EN_CURSO).get();
            return toExamenResponse(enCurso);
        }

        // Generar pool si no existe o es insuficiente
        if (preguntaRepo.countByPlanMaestroId(planMaestroId) < MIN_POOL) {
            generarPool(planMaestroId, request);
        }

        // Seleccionar 10 preguntas: estrategia varía según intento
        List<PreguntaConocimiento> seleccionadas = seleccionarPreguntas(
                planMaestroId, usuarioId, intentosUsados + 1);
        if (seleccionadas.size() < PREGUNTAS_EXAMEN) {
            throw new IllegalStateException("Pool de preguntas insuficiente. Intenta de nuevo en unos momentos.");
        }

        // Incrementar contador de uso
        seleccionadas.forEach(p -> p.setVecesUsada(p.getVecesUsada() + 1));
        preguntaRepo.saveAll(seleccionadas);

        // Crear examen
        Examen examen = Examen.builder()
                .usuarioId(usuarioId)
                .planMaestroId(planMaestroId)
                .planTitulo(request.planTitulo())
                .intento(intentosUsados + 1)
                .build();
        examen = examenRepo.save(examen);

        // Crear preguntas del examen
        List<PreguntaExamen> preguntasExamen = new ArrayList<>();
        for (int i = 0; i < seleccionadas.size(); i++) {
            preguntasExamen.add(PreguntaExamen.builder()
                    .examen(examen)
                    .pregunta(seleccionadas.get(i))
                    .orden(i + 1)
                    .build());
        }
        examen.setPreguntas(preguntasExamen);
        examen = examenRepo.save(examen);

        log.info("Examen iniciado para usuario {} — plan {} (intento {})", usuarioId, planMaestroId, examen.getIntento());
        return toExamenResponse(examen);
    }

    // ── Responder examen ─────────────────────────────────────────────

    @Transactional
    public ResultadoExamenResponse responderExamen(UUID examenId, String usuarioId,
                                                    ResponderExamenRequest request) {
        Examen examen = examenRepo.findById(examenId)
                .orElseThrow(() -> new NoSuchElementException("Examen no encontrado"));

        if (!usuarioId.equals(examen.getUsuarioId())) {
            throw new SecurityException("Acceso no autorizado.");
        }
        if (examen.getEstado() != EstadoExamen.EN_CURSO) {
            throw new IllegalStateException("Este examen ya fue finalizado.");
        }

        // Calificar cada pregunta
        int correctas = 0;
        List<UUID> preguntasIncorrectas = new ArrayList<>();

        for (PreguntaExamen pe : examen.getPreguntas()) {
            Integer respuesta = request.respuestas().get(pe.getId());
            if (respuesta == null) continue;

            pe.setRespuestaUsuario(respuesta);
            boolean esCorrecta = respuesta == pe.getPregunta().getRespuestaCorrecta();
            pe.setCorrecta(esCorrecta);
            if (esCorrecta) correctas++;
            else preguntasIncorrectas.add(pe.getPregunta().getId());
        }

        boolean aprobado = correctas >= MINIMO_APROBACION;
        examen.setPuntaje(correctas);
        examen.setEstado(aprobado ? EstadoExamen.APROBADO : EstadoExamen.REPROBADO);
        examen.setFinalizadoEn(LocalDateTime.now());
        examenRepo.save(examen);

        // Si aprobó: emitir certificado
        UUID certId = null;
        UUID codigoVerif = null;
        if (aprobado) {
            Certificado cert = Certificado.builder()
                    .usuarioId(usuarioId)
                    .planMaestroId(examen.getPlanMaestroId())
                    .planTitulo(examen.getPlanTitulo())
                    .puntaje(correctas)
                    .build();
            cert = certificadoRepo.save(cert);
            certId     = cert.getId();
            codigoVerif = cert.getCodigoVerificacion();
            log.info("Certificado emitido {} para usuario {} — plan {}", certId, usuarioId, examen.getPlanMaestroId());
        }

        // Temas a repasar si reprobó
        List<String> temasARepasar = List.of();
        int intentosRestantes = 0;
        if (!aprobado) {
            temasARepasar = obtenerTemasARepasar(preguntasIncorrectas);
            int intentosUsados = examenRepo.countByUsuarioIdAndPlanMaestroId(usuarioId, examen.getPlanMaestroId());
            intentosRestantes = Math.max(0, MAX_INTENTOS - intentosUsados);
        }

        log.info("Examen {} finalizado — {}/{} correctas — {}",
                examenId, correctas, PREGUNTAS_EXAMEN, aprobado ? "APROBADO" : "REPROBADO");

        return new ResultadoExamenResponse(
                examenId, examen.getEstado(), correctas, PREGUNTAS_EXAMEN,
                aprobado, intentosRestantes, temasARepasar, certId, codigoVerif
        );
    }

    // ── Listar certificados del usuario ──────────────────────────────

    @Transactional(readOnly = true)
    public List<Certificado> listarCertificados(String usuarioId) {
        return certificadoRepo.findByUsuarioIdOrderByEmitidoEnDesc(usuarioId);
    }

    // ── Verificar certificado (público) ──────────────────────────────

    @Transactional(readOnly = true)
    public Optional<Certificado> verificar(UUID codigo) {
        return certificadoRepo.findByCodigoVerificacion(codigo);
    }

    // ── Selección inteligente de preguntas ───────────────────────────

    private List<PreguntaConocimiento> seleccionarPreguntas(
            UUID planMaestroId, String usuarioId, int intento) {

        if (intento <= 1) {
            // Primer intento: 10 preguntas aleatorias del pool (menos usadas primero)
            return preguntaRepo.findDiezAleatorias(planMaestroId);
        }

        // Segundo intento: mezcla inteligente
        // 4 preguntas que respondió MAL (para que pueda redimirse)
        int maxIncorrectas = 4;
        List<PreguntaConocimiento> incorrectas =
                preguntaRepo.findIncorrectasPrevias(usuarioId, planMaestroId, maxIncorrectas);

        // Completar con preguntas NUEVAS que no vio antes
        int nuevasNecesarias = PREGUNTAS_EXAMEN - incorrectas.size();
        List<PreguntaConocimiento> nuevas =
                preguntaRepo.findNuevasNoVistas(usuarioId, planMaestroId, nuevasNecesarias);

        List<PreguntaConocimiento> resultado = new ArrayList<>(incorrectas);
        resultado.addAll(nuevas);

        // Si no hay suficientes nuevas, completar con aleatorias del pool
        if (resultado.size() < PREGUNTAS_EXAMEN) {
            int faltantes = PREGUNTAS_EXAMEN - resultado.size();
            Set<UUID> yaIncluidas = resultado.stream()
                    .map(PreguntaConocimiento::getId).collect(Collectors.toSet());
            preguntaRepo.findDiezAleatorias(planMaestroId).stream()
                    .filter(p -> !yaIncluidas.contains(p.getId()))
                    .limit(faltantes)
                    .forEach(resultado::add);
        }

        // Mezclar para que no sea obvio cuáles son las del reintento
        java.util.Collections.shuffle(resultado);
        return resultado;
    }

    // ── Generar pool de preguntas con IA ─────────────────────────────

    private void generarPool(UUID planMaestroId, IniciarExamenRequest request) {
        log.info("Generando pool de preguntas para plan {}", planMaestroId);

        String sistema = """
                Eres un evaluador académico experto en diseño de exámenes de certificación técnica.
                Genera preguntas de opción múltiple rigurosas, variadas y con vocabulario técnico preciso.

                REGLAS OBLIGATORIAS — incumplirlas invalida el examen:
                1. USA SIEMPRE los términos técnicos en inglés o su nombre correcto: escribe "string", "int", "float",
                   "list", "dict", "tuple", "boolean", "array", "class", "method", "function", "query", "index",
                   "transaction", etc. NUNCA los traduzcas (NO "cadena", NO "entero", NO "flotante", NO "lista").
                2. PROHIBIDO estructuras de pregunta repetidas: si ya preguntaste "¿qué operación puedes hacer con X?",
                   NO hagas la misma pregunta cambiando solo X por otro tipo de dato.
                3. Cada pregunta debe evaluar un concepto o habilidad DISTINTO a las demás.
                4. El texto debe tener 2-3 oraciones: contexto técnico específico + pregunta concreta.
                5. Cada opción debe ser una frase técnica completa y plausible (mínimo 8 palabras).
                6. Las opciones incorrectas deben ser errores comunes reales, no variantes obvias.
                7. Varía los tipos: comprensión conceptual, análisis de código, casos de uso, debugging, comparación.

                Responde ÚNICAMENTE con JSON válido.
                """;

        StringBuilder contenido = new StringBuilder();
        contenido.append("Plan: ").append(request.planTitulo()).append("\n\nMódulos y temas:\n");
        if (request.modulos() != null) {
            for (var modulo : request.modulos()) {
                contenido.append("- Módulo: ").append(modulo.titulo()).append("\n");
                if (modulo.temas() != null) {
                    modulo.temas().forEach(t -> contenido.append("  • ").append(t).append("\n"));
                }
            }
        }

        String usuario = String.format("""
                %s

                Genera exactamente 30 preguntas ÚNICAS, DIVERSAS y con vocabulario técnico correcto.
                Cada pregunta debe evaluar un aspecto DIFERENTE — ninguna puede tener la misma estructura que otra.
                Cada pregunta debe tener exactamente 4 opciones (A, B, C, D).
                Distribución obligatoria: 8 comprensión conceptual, 8 comparación entre conceptos,
                8 aplicación/código práctico, 6 análisis de errores o casos límite.
                RECUERDA: usa "string", "int", "float", "list", "dict" etc., NUNCA sus traducciones al español.

                EJEMPLO de buena pregunta:
                {
                  "texto": "En el contexto de Python, las listas son estructuras de datos mutables y ordenadas. ¿Cuál de las siguientes operaciones modifica directamente una lista existente en lugar de crear una nueva?",
                  "opciones": [
                    "Usar el operador + para concatenar dos listas y asignar el resultado a una nueva variable",
                    "Llamar al método .append() para agregar un elemento al final de la lista",
                    "Usar list() para convertir una tupla en una nueva lista",
                    "Aplicar slicing con [:] para obtener una copia superficial de la lista"
                  ],
                  "respuestaCorrecta": 1,
                  "explicacion": "El método .append() modifica la lista original en memoria (in-place), mientras que las demás opciones crean nuevos objetos."
                }

                Responde con este JSON:
                {
                  "preguntas": [
                    {
                      "moduloTitulo": "nombre exacto del módulo",
                      "temaTitulo": "nombre exacto del tema",
                      "texto": "Contexto de la situación (1-2 oraciones). ¿Pregunta concreta y específica?",
                      "opciones": ["Opción A completa y descriptiva", "Opción B completa", "Opción C completa", "Opción D completa"],
                      "respuestaCorrecta": 0,
                      "explicacion": "Explicación detallada de por qué la respuesta correcta es correcta y por qué las otras no."
                    }
                  ]
                }
                """, contenido.toString());

        try {
            JsonNode resp = groq.generarPreguntas(sistema, usuario);
            JsonNode preguntas = resp.path("preguntas");

            // Deduplicar por texto normalizado antes de guardar
            Set<String> textosVistos = new HashSet<>();
            List<PreguntaConocimiento> pool = new ArrayList<>();

            for (JsonNode p : preguntas) {
                String textoNorm = p.path("texto").asText("").toLowerCase().trim();
                if (textoNorm.isBlank() || !textosVistos.add(textoNorm)) {
                    continue; // saltar duplicados
                }

                List<String> opciones = new ArrayList<>();
                p.path("opciones").forEach(o -> opciones.add(o.asText()));

                pool.add(PreguntaConocimiento.builder()
                        .planMaestroId(planMaestroId)
                        .moduloTitulo(p.path("moduloTitulo").asText())
                        .temaTitulo(p.path("temaTitulo").asText(""))
                        .texto(p.path("texto").asText())
                        .opciones(objectMapper.writeValueAsString(opciones))
                        .respuestaCorrecta(p.path("respuestaCorrecta").asInt(0))
                        .explicacion(p.path("explicacion").asText(""))
                        .build());
            }

            preguntaRepo.saveAll(pool);
            log.info("Pool generado: {} preguntas únicas para plan {}", pool.size(), planMaestroId);

        } catch (Exception e) {
            log.error("Error generando pool para plan {}: {}", planMaestroId, e.getMessage());
            throw new RuntimeException("No se pudo generar el banco de preguntas: " + e.getMessage(), e);
        }
    }

    // ── Helpers ──────────────────────────────────────────────────────

    private List<String> obtenerTemasARepasar(List<UUID> preguntaIds) {
        if (preguntaIds.isEmpty()) return List.of();
        return preguntaRepo.findModuloYTemaPorIds(preguntaIds).stream()
                .map(row -> row[1] != null ? (String) row[1] : (String) row[0])
                .distinct()
                .limit(5)
                .collect(Collectors.toList());
    }

    private ExamenResponse toExamenResponse(Examen examen) {
        List<ExamenResponse.PreguntaDTO> preguntas = examen.getPreguntas().stream()
                .map(pe -> {
                    List<String> opciones;
                    try {
                        opciones = objectMapper.readValue(
                                pe.getPregunta().getOpciones(),
                                objectMapper.getTypeFactory().constructCollectionType(List.class, String.class));
                    } catch (Exception e) {
                        opciones = List.of();
                    }
                    return new ExamenResponse.PreguntaDTO(
                            pe.getId(), pe.getOrden(),
                            pe.getPregunta().getTexto(), opciones);
                })
                .collect(Collectors.toList());

        return new ExamenResponse(
                examen.getId(), examen.getPlanTitulo(),
                examen.getIntento(), examen.getEstado(), preguntas);
    }
}

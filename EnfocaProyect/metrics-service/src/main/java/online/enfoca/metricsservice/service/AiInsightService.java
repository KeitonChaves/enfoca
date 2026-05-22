package online.enfoca.metricsservice.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import online.enfoca.metricsservice.dto.AiInsightDTO;
import online.enfoca.metricsservice.entity.AiInsight;
import online.enfoca.metricsservice.entity.DailySummary;
import online.enfoca.metricsservice.entity.Streak;
import online.enfoca.metricsservice.ia.ClienteGroqInsight;
import online.enfoca.metricsservice.repository.AiInsightRepository;
import online.enfoca.metricsservice.repository.DailySummaryRepository;
import online.enfoca.metricsservice.repository.StreakRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AiInsightService {

    private static final Logger log = LoggerFactory.getLogger(AiInsightService.class);

    private final AiInsightRepository    aiInsightRepository;
    private final DailySummaryRepository dailySummaryRepository;
    private final StreakRepository       streakRepository;
    private final ClienteGroqInsight     groq;
    private final ObjectMapper           objectMapper;

    @Value("${app.metrics.streak-timezone:America/Santiago}")
    private String timezone;

    private LocalDate today() {
        return LocalDate.now(ZoneId.of(timezone));
    }

    // ── Obtener insight de la semana actual ──────────────────────────

    @Transactional
    public AiInsightDTO getCurrentWeekInsight(Long userId) {
        LocalDate weekStart = today().with(DayOfWeek.MONDAY);

        return aiInsightRepository.findByUserIdAndWeekStart(userId, weekStart)
                .map(this::toDTO)
                .orElseGet(() -> {
                    AiInsight generated = generateInsight(userId, weekStart);
                    aiInsightRepository.save(generated);
                    return toDTO(generated);
                });
    }

    // ── Obtener el insight más reciente ──────────────────────────────

    @Transactional(readOnly = true)
    public AiInsightDTO getLatestInsight(Long userId) {
        return aiInsightRepository
                .findTopByUserIdOrderByWeekStartDesc(userId)
                .map(this::toDTO)
                .orElse(buildEmptyInsight());
    }

    // ── Job programado: todos los domingos a las 23:30 ───────────────

    @Scheduled(cron = "0 30 23 * * SUN", zone = "America/Santiago")
    @Transactional
    public void generarInsightsSemanales() {
        LocalDate weekStart = today().with(DayOfWeek.MONDAY);
        List<Long> usuarios = dailySummaryRepository
                .findActiveUserIdsBetween(weekStart, today());

        log.info("Job semanal: generando insights para {} usuarios activos", usuarios.size());

        for (Long userId : usuarios) {
            try {
                // Eliminar si ya existe para regenerar con datos finales
                aiInsightRepository.findByUserIdAndWeekStart(userId, weekStart)
                        .ifPresent(aiInsightRepository::delete);

                AiInsight insight = generateInsight(userId, weekStart);
                aiInsightRepository.save(insight);
                log.info("Insight generado para usuario {}", userId);
            } catch (Exception e) {
                log.error("Error generando insight para usuario {}: {}", userId, e.getMessage());
            }
        }
    }

    // ── Generar insight llamando a Groq ──────────────────────────────

    private AiInsight generateInsight(Long userId, LocalDate weekStart) {
        LocalDate weekEnd = weekStart.plusDays(6);

        List<DailySummary> week = dailySummaryRepository
                .findByUserIdAndSummaryDateBetweenOrderBySummaryDateAsc(userId, weekStart, weekEnd);

        Streak streak = streakRepository.findByUserId(userId)
                .orElse(Streak.builder().userId(userId).build());

        int totalMinutes  = week.stream().mapToInt(DailySummary::getFocusedMinutes).sum();
        int totalSessions = week.stream().mapToInt(DailySummary::getSessionsCount).sum();
        int activeDays    = (int) week.stream().filter(d -> d.getFocusedMinutes() > 0).count();

        String bestDay = week.stream()
                .filter(ds -> ds.getFocusedMinutes() > 0)
                .max(Comparator.comparingInt(DailySummary::getFocusedMinutes))
                .map(ds -> traducirDia(ds.getSummaryDate().getDayOfWeek()))
                .orElse("N/A");

        // Intentar generar con LLM; si falla, usar texto heurístico
        String summary;
        String recommendation;
        try {
            JsonNode respuesta = llamarLlm(totalMinutes, totalSessions, activeDays,
                    streak.getCurrentStreak(), week);
            summary        = respuesta.path("resumen").asText(buildSummaryFallback(totalMinutes, totalSessions));
            recommendation = respuesta.path("recomendacion").asText(buildRecommendationFallback(totalMinutes, activeDays));
            String bestDayLlm = respuesta.path("diaMasProductivo").asText("");
            if (!bestDayLlm.isBlank()) bestDay = bestDayLlm;
        } catch (Exception e) {
            log.warn("LLM no disponible para insight, usando texto heurístico: {}", e.getMessage());
            summary        = buildSummaryFallback(totalMinutes, totalSessions);
            recommendation = buildRecommendationFallback(totalMinutes, activeDays);
        }

        return AiInsight.builder()
                .userId(userId)
                .weekStart(weekStart)
                .summary(summary)
                .bestDay(bestDay)
                .recommendation(recommendation)
                .build();
    }

    private JsonNode llamarLlm(int totalMinutos, int sesiones, int diasActivos,
                                int racha, List<DailySummary> dias) {
        String sistema = """
                Eres un coach de productividad académica. Analiza los datos de estudio del usuario
                y genera un análisis motivador, realista y personalizado.
                Responde ÚNICAMENTE con JSON válido con estos campos:
                {"resumen": "2 párrafos narrativos", "diaMasProductivo": "nombre del día en español", "recomendacion": "1 acción concreta para la próxima semana"}
                """;

        StringBuilder distribucion = new StringBuilder();
        for (DailySummary d : dias) {
            if (d.getFocusedMinutes() > 0) {
                distribucion.append(String.format("  - %s: %.1fh (%d sesiones)%n",
                        traducirDia(d.getSummaryDate().getDayOfWeek()),
                        d.getFocusedMinutes() / 60.0,
                        d.getSessionsCount()));
            }
        }

        double totalHoras = totalMinutos / 60.0;
        String usuario = String.format("""
                Analiza esta semana de estudio:
                - Horas enfocadas totales: %.1f h
                - Distribución por día:
                %s
                - Sesiones Pomodoro completadas: %d
                - Días activos: %d de 7
                - Racha actual: %d días consecutivos

                Genera el JSON con resumen (2 párrafos, tono motivador pero honesto),
                diaMasProductivo (solo el nombre del día con más horas) y
                recomendacion (una acción específica y accionable para mejorar la próxima semana).
                """, totalHoras, distribucion.toString(), sesiones, diasActivos, racha);

        try {
            String raw = groq.llamar(sistema, usuario);
            return objectMapper.readTree(raw);
        } catch (Exception e) {
            throw new RuntimeException("Error parseando respuesta LLM: " + e.getMessage(), e);
        }
    }

    // ── Fallbacks sin LLM ────────────────────────────────────────────

    private String buildSummaryFallback(int totalMinutes, int totalSessions) {
        int h = totalMinutes / 60, m = totalMinutes % 60;
        if (totalMinutes == 0) return "Sin sesiones registradas esta semana. ¡Es momento de retomar el ritmo!";
        return String.format("Esta semana completaste %d sesiones acumulando %dh %02dm de estudio enfocado.", totalSessions, h, m);
    }

    private String buildRecommendationFallback(int totalMinutes, int activeDays) {
        if (totalMinutes == 0)  return "Intenta comenzar con una sesión de 25 minutos mañana por la mañana.";
        if (activeDays <= 2)    return "Incrementa tu consistencia. Apunta a al menos 4 días activos la próxima semana.";
        if (totalMinutes < 120) return "Buen inicio. Intenta agregar 15 minutos adicionales por sesión.";
        return "Excelente consistencia. Mantén este ritmo y considera aumentar la dificultad del material.";
    }

    private String traducirDia(DayOfWeek dia) {
        return switch (dia) {
            case MONDAY    -> "Lunes";
            case TUESDAY   -> "Martes";
            case WEDNESDAY -> "Miércoles";
            case THURSDAY  -> "Jueves";
            case FRIDAY    -> "Viernes";
            case SATURDAY  -> "Sábado";
            case SUNDAY    -> "Domingo";
        };
    }

    // ── Mapper ───────────────────────────────────────────────────────

    private AiInsightDTO toDTO(AiInsight insight) {
        return AiInsightDTO.builder()
                .weekStart(insight.getWeekStart())
                .summary(insight.getSummary())
                .bestDay(insight.getBestDay())
                .recommendation(insight.getRecommendation())
                .generatedAt(insight.getGeneratedAt())
                .build();
    }

    private AiInsightDTO buildEmptyInsight() {
        return AiInsightDTO.builder()
                .summary("Aún no hay datos suficientes para generar un insight.")
                .recommendation("Completa tu primera sesión de estudio para comenzar.")
                .build();
    }
}

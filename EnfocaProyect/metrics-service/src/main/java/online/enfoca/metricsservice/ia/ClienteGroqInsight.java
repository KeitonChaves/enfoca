package online.enfoca.metricsservice.ia;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;

@Component
public class ClienteGroqInsight {

    private static final Logger log = LoggerFactory.getLogger(ClienteGroqInsight.class);

    private final RestClient restClient;
    private final ObjectMapper objectMapper;
    private final String modelo;

    public ClienteGroqInsight(
            @Value("${app.groq.api-key}") String apiKey,
            @Value("${app.groq.url}") String url,
            @Value("${app.groq.modelo}") String modelo,
            ObjectMapper objectMapper) {
        this.modelo       = modelo;
        this.objectMapper = objectMapper;
        this.restClient   = RestClient.builder()
                .baseUrl(url)
                .defaultHeader("Authorization", "Bearer " + apiKey)
                .defaultHeader("Content-Type", "application/json")
                .build();
    }

    public String llamar(String sistema, String usuario) {
        Map<String, Object> body = Map.of(
                "model", modelo,
                "temperature", 0.6,
                "response_format", Map.of("type", "json_object"),
                "messages", List.of(
                        Map.of("role", "system", "content", sistema),
                        Map.of("role", "user",   "content", usuario)
                )
        );

        try {
            String raw = restClient.post()
                    .body(body)
                    .retrieve()
                    .body(String.class);

            JsonNode node = objectMapper.readTree(raw);
            String content = node.path("choices").path(0)
                    .path("message").path("content").asText();

            log.info("Groq respondió para insight ({} chars)", content.length());
            return content;

        } catch (Exception e) {
            log.error("Error llamando a Groq para insight: {}", e.getMessage());
            throw new RuntimeException("Groq no disponible: " + e.getMessage(), e);
        }
    }
}

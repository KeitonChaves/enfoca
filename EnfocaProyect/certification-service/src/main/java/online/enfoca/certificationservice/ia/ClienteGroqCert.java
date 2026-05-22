package online.enfoca.certificationservice.ia;

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
public class ClienteGroqCert {

    private static final Logger log = LoggerFactory.getLogger(ClienteGroqCert.class);

    private final RestClient restClient;
    private final ObjectMapper objectMapper;
    private final String modelo;

    public ClienteGroqCert(
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

    public JsonNode generarPreguntas(String sistema, String usuario) {
        Map<String, Object> body = Map.of(
                "model", modelo,
                "temperature", 0.7,
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

            JsonNode root    = objectMapper.readTree(raw);
            String   content = root.path("choices").path(0)
                    .path("message").path("content").asText();

            log.info("Groq generó preguntas ({} chars)", content.length());
            return objectMapper.readTree(content);

        } catch (Exception e) {
            log.error("Error generando preguntas con Groq: {}", e.getMessage());
            throw new RuntimeException("Groq no disponible: " + e.getMessage(), e);
        }
    }
}

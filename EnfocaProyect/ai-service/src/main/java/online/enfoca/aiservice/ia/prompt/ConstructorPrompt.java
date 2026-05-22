package online.enfoca.aiservice.ia.prompt;

import jakarta.annotation.PostConstruct;
import online.enfoca.aiservice.dominio.PlanEstudio;
import online.enfoca.aiservice.dto.CrearPlanRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Component;
import org.springframework.util.StreamUtils;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

@Component
public class ConstructorPrompt {

    private static final Logger log = LoggerFactory.getLogger(ConstructorPrompt.class);

    private final ResourceLoader resourceLoader;

    private String sistemaPlan;
    private String plantillaPlan;
    private String sistemaMejora;
    private String plantillaMejora;
    private String sistemaMejoraPersonal;
    private String plantillaMejoraPersonal;
    private String plantillaMejoraComunitaria;
    private String sistemaCuestionario;
    private String plantillaCuestionario;

    public ConstructorPrompt(ResourceLoader resourceLoader) {
        this.resourceLoader = resourceLoader;
    }

    @PostConstruct
    public void cargarPrompts() throws IOException {
        this.sistemaPlan              = leer("classpath:prompts/sistema-generacion.txt");
        this.plantillaPlan            = leer("classpath:prompts/usuario-generacion.txt");
        this.sistemaMejora            = leer("classpath:prompts/sistema-mejora.txt");
        this.plantillaMejora          = leer("classpath:prompts/usuario-mejora.txt");
        this.sistemaMejoraPersonal    = leer("classpath:prompts/sistema-mejora-personal.txt");
        this.plantillaMejoraPersonal  = leer("classpath:prompts/usuario-mejora-personal.txt");
        this.plantillaMejoraComunitaria = leer("classpath:prompts/usuario-mejora-comunitaria.txt");
        this.sistemaCuestionario      = leer("classpath:prompts/sistema-cuestionario.txt");
        this.plantillaCuestionario    = leer("classpath:prompts/usuario-cuestionario.txt");
        log.info("Prompts de IA cargados desde resources/prompts/");
    }

    public String[] promptGeneracion(CrearPlanRequest request) {
        String usuario = plantillaPlan
                .replace("{materia}", request.materia())
                .replace("{tiempo}", request.tiempoDisponible())
                .replace("{objetivo}", request.objetivo() != null ? request.objetivo() : "Aprender los fundamentos del tema")
                .replace("{nivel}", request.nivelEfectivo().name());
        return new String[]{ sistemaPlan, usuario };
    }

    public String[] promptMejora(PlanEstudio plan, String planJson) {
        String usuario = plantillaMejora
                .replace("{plan_json}", planJson);
        return new String[]{ sistemaMejora, usuario };
    }

    public String[] promptMejoraPersonal(String planJson, String motivo, String motivoLabel, String detalle) {
        String usuario = plantillaMejoraPersonal
                .replace("{plan_json}", planJson)
                .replace("{motivo_label}", motivoLabel)
                .replace("{detalle}", detalle != null && !detalle.isBlank() ? detalle : "Sin detalle adicional.");
        return new String[]{ sistemaMejoraPersonal, usuario };
    }

    public String[] promptMejoraComunitaria(String planJson, String feedbacksResumen) {
        String usuario = plantillaMejoraComunitaria
                .replace("{plan_json}", planJson)
                .replace("{feedbacks_resumen}", feedbacksResumen);
        return new String[]{ sistemaMejora, usuario };
    }

    public String[] promptCuestionario(String moduloTitulo, String temasLista) {
        String usuario = plantillaCuestionario
                .replace("{modulo_titulo}", moduloTitulo)
                .replace("{temas_lista}", temasLista);
        return new String[]{ sistemaCuestionario, usuario };
    }

    private String leer(String ubicacion) throws IOException {
        Resource resource = resourceLoader.getResource(ubicacion);
        return StreamUtils.copyToString(resource.getInputStream(), StandardCharsets.UTF_8);
    }
}

package co.airy.core.api.config;

import co.airy.log.AiryLoggerFactory;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.AsyncResult;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.concurrent.Future;

@Component
public class HealthApi {
    private static final Logger log = AiryLoggerFactory.getLogger(HealthApi.class);
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final String namespace;
    private final RestTemplate restTemplate;

    public HealthApi(@Value("${kubernetes.namespace}") String namespace, RestTemplate restTemplate) {
        this.namespace = namespace;
        this.restTemplate = restTemplate;
    }

    @Async
    public Future<Boolean> isHealthy(String service) {
        try {
            final ResponseEntity<String> response = restTemplate.getForEntity(String.format("http://%s.%s/actuator/health", service, namespace), String.class);
            final JsonNode jsonNode = objectMapper.readTree(response.getBody());
            return new AsyncResult<>("UP".equalsIgnoreCase(jsonNode.get("status").textValue()));
        } catch (Exception e) {
            return new AsyncResult<>(false);
        }
    }
}


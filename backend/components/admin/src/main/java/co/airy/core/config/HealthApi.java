package co.airy.core.config;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.AsyncResult;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.concurrent.Future;

@Component
public class HealthApi {
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final String namespace;
    private final String adminAppName;
    private final RestTemplate restTemplate;

    public HealthApi(@Value("${kubernetes.namespace}") String namespace, @Value("${kubernetes.app}") String adminAppName, RestTemplate restTemplate) {
        this.namespace = namespace;
        this.adminAppName = adminAppName;
        this.restTemplate = restTemplate;
    }

    @Async
    public Future<Boolean> isHealthy(String service) {
        if (service.equalsIgnoreCase(adminAppName)) {
            // Loop-back requests might not be possible in minikube (https://github.com/kubernetes/minikube/issues/1568)
            return new AsyncResult<>(true);
        }

        try {
            final ResponseEntity<String> response = restTemplate.getForEntity(String.format("http://%s.%s/actuator/health", service, namespace), String.class);
            final JsonNode jsonNode = objectMapper.readTree(response.getBody());
            return new AsyncResult<>("UP".equalsIgnoreCase(jsonNode.get("status").textValue()));
        } catch (Exception e) {
            return new AsyncResult<>(false);
        }
    }
}


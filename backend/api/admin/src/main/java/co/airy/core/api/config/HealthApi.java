package co.airy.core.api.config;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.AsyncResult;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.Map;
import java.util.concurrent.Future;

@Component
public class HealthApi {
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final RestTemplate restTemplate;
    private final String namespace;

    public HealthApi(@Value("${kubernetes.namespace}") String namespace, RestTemplate restTemplate) {
        this.namespace = namespace;
        this.restTemplate = restTemplate;
    }

    @Async
    public Future<HealthResponse> getStatus(String component) {
        try {
            ResponseEntity<String> response = restTemplate.getForEntity(String.format("http://%s.%s/actuator/health", component, namespace), String.class);


            final JsonNode jsonNode = objectMapper.readTree(response.getBody());

            final HealthResponse.ComponentStatusBuilder builder = HealthResponse.builder().healthy("UP".equals(jsonNode.get("status").textValue()));

            jsonNode.get("components").get("healthData");


            components.put(service.replace("-connector", ""), Map.of("enabled", response.getStatusCode().is2xxSuccessful()));
        } catch (Exception e) {
            return  new AsyncResult<>(HealthResponse.builder().healthy(false).build());
        }
    }
}

package co.airy.core.api.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class ServiceDiscovery {
    private final String namespace;
    private final RestTemplate restTemplate;

    private final Map<String, Map<String, Object>> components = new ConcurrentHashMap<>();

    private static final List<String> services = List.of(
            "sources-chatplugin",
            "sources-facebook-connector",
            "sources-twilio-connector",
            "sources-google-connector"
    );

    public ServiceDiscovery(@Value("${kubernetes.namespace}") String namespace, RestTemplate restTemplate) {
        this.namespace = namespace;
        this.restTemplate = restTemplate;
    }

    public Map<String, Map<String, Object>> getComponents() {
        return components;
    }

    @Scheduled(fixedRate = 1_000)
    private void updateComponentsStatus() {
        for (String service : services) {
            try {
                ResponseEntity<Object> response = restTemplate.exchange(String.format("http://%s.%s/actuator/health", service, namespace), HttpMethod.GET, null, Object.class);
                components.put(service.replace("-connector", ""), Map.of("enabled", response.getStatusCode().is2xxSuccessful()));
            } catch (Exception e) {
                components.put(service.replace("-connector", ""), Map.of("enabled",false));
            }
        }
    }
}

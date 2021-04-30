package co.airy.core.api.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArraySet;

@Component
public class ServiceDiscovery {
    private final String namespace;
    private final RestTemplate restTemplate;

    private Map<String, Map<String, Object>> components = new ConcurrentHashMap<>();

    public ServiceDiscovery(@Value("${kubernetes.namespace}") String namespace, RestTemplate restTemplate) {
        this.namespace = namespace;
        this.restTemplate = restTemplate;
    }

    public Map<String, Map<String, Object>> getComponents() {
        return components;
    }

    @Scheduled(fixedRate = 1_000)
    private void updateComponentsStatus() {
        final ResponseEntity<ComponentsResponsePayload> response = restTemplate.getForEntity("http://airy-controller.default/components", ComponentsResponsePayload.class);
        Map<String, Map<String, Object>> newComponents = new ConcurrentHashMap<>();
        for (String component: response.getBody().getComponents()) {
            newComponents.put(component, Map.of("enabled", true));
        }
        components.clear();
        components.putAll(newComponents);
    }
}

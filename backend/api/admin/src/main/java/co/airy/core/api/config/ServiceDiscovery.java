package co.airy.core.api.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.HashSet;
import java.util.Set;
import java.util.concurrent.CopyOnWriteArraySet;

@Component
public class ServiceDiscovery {
    private final String namespace;
    private final RestTemplate restTemplate;

    private Set<ComponentResponsePayload> components = new CopyOnWriteArraySet<>();

    public ServiceDiscovery(@Value("${kubernetes.namespace}") String namespace, RestTemplate restTemplate) {
        this.namespace = namespace;
        this.restTemplate = restTemplate;
    }

    public Set<ComponentResponsePayload> getComponents() {
        return components;
    }

    @Scheduled(fixedRate = 1_000)
    private void updateComponentsStatus() {
        final ResponseEntity<ComponentsResponsePayload> response = restTemplate.getForEntity("http://airy-controller.default/components", ComponentsResponsePayload.class);
        Set<ComponentResponsePayload> newComponents = new HashSet<>();
        for (String component: response.getBody().getComponents()) {
            newComponents.add(ComponentResponsePayload.builder()
                    .enabled(true)
                    .name(component)
                    .build());
        }
        components.clear();
        components.addAll(newComponents);
    }
}

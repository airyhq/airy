package co.airy.core.api.config;

import co.airy.core.api.admin.payload.ClientConfigResponsePayload;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
public class ClientConfigController {

    private final ServiceDiscovery serviceDiscovery;
    private final String namespace;
    private final RestTemplate restTemplate;

    public ClientConfigController(ServiceDiscovery serviceDiscovery, @Value("${kubernetes.namespace}") String namespace, RestTemplate restTemplate) {
        this.serviceDiscovery = serviceDiscovery;
        this.namespace = namespace;
        this.restTemplate = restTemplate;
    }

    @PostMapping("/client.config")
    public ResponseEntity<ClientConfigResponsePayload> getConfig() {
        List<Map<String, Map<String, String>>> components = new ArrayList<>();

        for (String service : serviceDiscovery.getServices()) {
            try {
                ResponseEntity<Object> response = restTemplate.exchange(String.format("http://%s.%s/actuator/health", service, namespace), HttpMethod.GET, null, Object.class);
                components.add(Map.of(service.replace("-connector", ""), Map.of("enabled", Boolean.toString(response.getStatusCode().is2xxSuccessful()))));
            } catch (Exception e) {
                components.add(Map.of(service.replace("-connector", ""), Map.of("enabled", Boolean.toString(false))));
            }
        }

        return ResponseEntity.ok(ClientConfigResponsePayload.builder()
                .components(components)
                .features(List.of())
                .build());
    }
}

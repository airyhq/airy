package co.airy.core.api.config;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class ClientConfigController {
    private final ServiceDiscovery serviceDiscovery;

    public ClientConfigController(ServiceDiscovery serviceDiscovery) {
        this.serviceDiscovery = serviceDiscovery;
    }

    @PostMapping("/client.config")
    public ResponseEntity<ClientConfigResponsePayload> getConfig() {
        return ResponseEntity.ok(ClientConfigResponsePayload.builder()
                .components(serviceDiscovery.getComponents())
                .features(Map.of())
                .build());
    }
}

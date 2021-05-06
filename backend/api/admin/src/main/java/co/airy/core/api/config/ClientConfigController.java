package co.airy.core.api.config;

import co.airy.spring.auth.PrincipalAccess;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ClientConfigController {
    private final ServiceDiscovery serviceDiscovery;

    public ClientConfigController(ServiceDiscovery serviceDiscovery) {
        this.serviceDiscovery = serviceDiscovery;
    }

    @PostMapping("/client.config")
    public ResponseEntity<ClientConfigResponsePayload> getConfig(Authentication auth) {
        return ResponseEntity.ok(ClientConfigResponsePayload.builder()
                .components(serviceDiscovery.getComponents())
                .userProfile(PrincipalAccess.getUserProfile(auth))
                .build());
    }
}

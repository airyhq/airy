package co.airy.core.api.config;

import co.airy.core.api.config.dto.TagConfig;
import co.airy.core.api.config.payload.ClientConfigResponsePayload;
import co.airy.spring.auth.PrincipalAccess;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ClientConfigController {
    private final ServiceDiscovery serviceDiscovery;
    private final PrincipalAccess principalAccess;
    private final TagConfig tagConfig;

    public ClientConfigController(ServiceDiscovery serviceDiscovery, PrincipalAccess principalAccess) {
        this.serviceDiscovery = serviceDiscovery;
        this.principalAccess = principalAccess;
        this.tagConfig = TagConfig.builder().build();
    }

    @PostMapping("/client.config")
    public ResponseEntity<ClientConfigResponsePayload> getConfig(Authentication auth) {
        return ResponseEntity.ok(ClientConfigResponsePayload.builder()
                .services(serviceDiscovery.getServices())
                .userProfile(principalAccess.getUserProfile(auth))
                .tagConfig(tagConfig)
                .build());
    }
}

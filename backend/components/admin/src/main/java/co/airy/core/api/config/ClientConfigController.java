package co.airy.core.api.config;

import co.airy.core.api.config.payload.ClientConfigResponsePayload;
import co.airy.spring.auth.PrincipalAccess;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.util.StreamUtils;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;

@RestController
public class ClientConfigController {
    private final ServiceDiscovery serviceDiscovery;
    private final PrincipalAccess principalAccess;
    private final JsonNode tagConfig;
    private final String clusterVersion;

    public ClientConfigController(ServiceDiscovery serviceDiscovery, PrincipalAccess principalAccess, @Value("classpath:VERSION") Resource version) throws IOException {
        this.serviceDiscovery = serviceDiscovery;
        this.principalAccess = principalAccess;
        final String tagConfigResource = StreamUtils.copyToString(getClass().getClassLoader().getResourceAsStream("tagConfig.json"), StandardCharsets.UTF_8);
        this.tagConfig = new ObjectMapper().readTree(tagConfigResource);
        try (InputStream is = version.getInputStream()) {
            clusterVersion = StreamUtils.copyToString(is, StandardCharsets.UTF_8);
        }
    }

    @PostMapping("/client.config")
    public ResponseEntity<ClientConfigResponsePayload> getConfig(Authentication auth) {
        return ResponseEntity.ok(ClientConfigResponsePayload.builder()
                .services(serviceDiscovery.getServices())
                .userProfile(principalAccess.getUserProfile(auth))
                .tagConfig(tagConfig)
                .clusterVersion(clusterVersion)
                .build());
    }
}

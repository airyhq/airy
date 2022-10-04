package co.airy.core.config.payload;

import co.airy.core.config.dto.ServiceInfo;
import co.airy.spring.auth.session.UserProfile;
import com.fasterxml.jackson.databind.JsonNode;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClientConfigResponsePayload {
    private Map<String, ServiceInfo> services;
    private UserProfile userProfile;
    private JsonNode tagConfig;
    private String clusterVersion;
}

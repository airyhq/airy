package co.airy.core.api.config;

import co.airy.spring.auth.session.UserProfile;
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
    private Map<String, Map<String, Object>> components;
    private UserProfile userProfile;
}

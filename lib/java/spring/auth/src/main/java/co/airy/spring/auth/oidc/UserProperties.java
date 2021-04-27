package co.airy.spring.auth.oidc;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Data
@Component
@ConfigurationProperties(prefix = "oidc")
public class UserProperties {
    private String allowedEmailPatterns;
    private String provider;
    private String clientId;
    private String clientSecret;
}

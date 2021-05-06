package co.airy.spring.auth.oidc;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.security.oauth2.core.AuthenticationMethod;
import org.springframework.security.oauth2.core.AuthorizationGrantType;
import org.springframework.security.oauth2.core.ClientAuthenticationMethod;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Data
@Component
@ConfigurationProperties(prefix = "oidc")
public class UserProperties {
    private String allowedEmailPatterns;
    private String provider;
    private String clientId;
    private String clientSecret;

    // Config values for manual provider configuration
    private String clientAuthenticationMethod;
    public ClientAuthenticationMethod getClientAuthenticationMethod() {
        return Optional.ofNullable(clientAuthenticationMethod).map(ClientAuthenticationMethod::new).orElse(null);
    }

    private String authorizationGrantType;
    public AuthorizationGrantType getAuthorizationGrantType() {
        return Optional.ofNullable(authorizationGrantType).map(AuthorizationGrantType::new).orElse(null);
    }

    private String authorizationUri;
    private String tokenUri;
    private String userInfoUri;

    private String userInfoAuthenticationMethod;
    public AuthenticationMethod getUserInfoAuthenticationMethod() {
        return Optional.ofNullable(userInfoAuthenticationMethod).map(AuthenticationMethod::new).orElse(null);
    }

    private String userNameAttributeName;
    private String issuerUri;
    private String jwkSetUri;

    private String scope;

    public Collection<String> getScope() {
        if (scope == null) {
            return null;
        }

        return Arrays.asList(scope.split(","));
    }
}

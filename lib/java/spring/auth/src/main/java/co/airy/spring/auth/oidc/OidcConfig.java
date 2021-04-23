package co.airy.spring.auth.oidc;

import lombok.Getter;
import org.springframework.security.config.oauth2.client.CommonOAuth2Provider;
import org.springframework.security.oauth2.client.registration.ClientRegistration;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class OidcConfig {
    @Getter
    private ClientRegistration registration;
    private List<String> allowedEmailPatterns;

    public OidcConfig(OidcProperties props) {
        if (props.getProvider() == null || props.getAllowedEmailPatterns() == null) {
            return;
        }

        ClientRegistration.Builder builder = ClientRegistration.withRegistrationId(props.getProvider());
        try {
            final CommonOAuth2Provider commonProvider = CommonOAuth2Provider.valueOf(props.getProvider().toUpperCase());
            builder = commonProvider.getBuilder(props.getProvider());
        } catch (Exception expected) {
        }

        this.registration = builder
                .clientId(props.getClientId())
                .clientSecret(props.getClientSecret()).build();

        this.allowedEmailPatterns = Arrays.asList(props.getAllowedEmailPatterns().split(","));
    }

    public boolean isPresent() {
        return this.allowedEmailPatterns != null && this.registration != null;
    }
}

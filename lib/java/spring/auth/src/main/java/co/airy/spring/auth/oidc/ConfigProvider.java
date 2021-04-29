package co.airy.spring.auth.oidc;

import lombok.Getter;
import org.springframework.security.oauth2.client.registration.ClientRegistration;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;
import java.util.function.Predicate;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Component
public class ConfigProvider {
    @Getter
    private ClientRegistration registration;
    private List<Predicate<String>> emailMatchers;

    public ConfigProvider(UserProperties props) {
        if (props.getProvider() == null || props.getAllowedEmailPatterns() == null) {
            return;
        }

        ClientRegistration.Builder builder = ClientRegistration.withRegistrationId(props.getProvider());
        try {
            final CommonProviders commonProvider = CommonProviders.valueOf(props.getProvider().toUpperCase());
            builder = commonProvider.getBuilder(props.getProvider());
        } catch (Exception expected) {
            // not a common oauth provider
        }

        builder.clientId(props.getClientId()).clientSecret(props.getClientSecret());

        if (props.getClientAuthenticationMethod() != null) {
            builder.clientAuthenticationMethod(props.getClientAuthenticationMethod());
        }
        if (props.getAuthorizationGrantType() != null) {
            builder.authorizationGrantType(props.getAuthorizationGrantType());
        }
        if (props.getAuthorizationUri() != null) {
            builder.authorizationUri(props.getAuthorizationUri());
        }
        if (props.getTokenUri() != null) {
            builder.tokenUri(props.getTokenUri());
        }
        if (props.getUserInfoUri() != null) {
            builder.userInfoUri(props.getUserInfoUri());
        }
        if (props.getUserInfoAuthenticationMethod() != null) {
            builder.userInfoAuthenticationMethod(props.getUserInfoAuthenticationMethod());
        }
        if (props.getUserNameAttributeName() != null) {
            builder.userNameAttributeName(props.getUserNameAttributeName());
        }
        if (props.getIssuerUri() != null) {
            builder.issuerUri(props.getIssuerUri());
        }
        if (props.getJwkSetUri() != null) {
            builder.jwkSetUri(props.getJwkSetUri());
        }
        if (props.getScope() != null) {
            builder.scope(props.getScope());
        }

        registration = builder.build();

        emailMatchers = Arrays.stream(props.getAllowedEmailPatterns().split(","))
                .map(this::regexFromWildcard).map(Pattern::asMatchPredicate).collect(Collectors.toList());
    }

    private Pattern regexFromWildcard(String pattern) {
        final String s = pattern.replaceAll("\\*", ".*");
        return Pattern.compile(s);
    }

    public boolean isPresent() {
        return emailMatchers != null && registration != null;
    }

    public boolean emailMatches(String email) {
        return emailMatchers.stream().anyMatch((matches) -> matches.test(email));
    }
}

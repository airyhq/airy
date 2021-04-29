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

        this.registration = builder
                .clientId(props.getClientId())
                .clientSecret(props.getClientSecret()).build();

        this.emailMatchers = Arrays.stream(props.getAllowedEmailPatterns().split(","))
                .map(this::regexFromWildcard).map(Pattern::asMatchPredicate).collect(Collectors.toList());
    }

    private Pattern regexFromWildcard(String pattern) {
        final String s = pattern.replaceAll("\\*", ".*");

        return Pattern.compile(s);
    }

    public boolean isPresent() {
        return this.emailMatchers != null && this.registration != null;
    }

    public boolean emailMatches(String email) {
        return emailMatchers.stream().anyMatch((matches) -> matches.test(email));
    }
}

package co.airy.spring.auth;

import co.airy.spring.auth.token.TokenPrincipal;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;

public class PrincipalAccess {
    public static final String ANON_PRINCIPAL = "airy-core-anonymous";

    public static String getUserId(Authentication authentication) {
        if (authentication == null) {
            return ANON_PRINCIPAL;
        }

        if (authentication instanceof TokenPrincipal) {
            return ((TokenPrincipal) authentication).getPrincipal();
        }

        if (authentication instanceof OAuth2AuthenticationToken) {
            final OAuth2User user = ((OAuth2AuthenticationToken) authentication).getPrincipal();

            // e.g. github:4403838
            return String.format("%s:%s", ((OAuth2AuthenticationToken) authentication).getAuthorizedClientRegistrationId(),
                    user.getAttribute("id"));
        }

        return authentication.getName();
    }
}

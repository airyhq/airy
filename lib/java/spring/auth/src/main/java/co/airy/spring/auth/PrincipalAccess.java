package co.airy.spring.auth;

import co.airy.spring.auth.session.AiryAuth;
import co.airy.spring.auth.session.UserProfile;
import co.airy.spring.auth.token.TokenAuth;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;

public class PrincipalAccess {
    public static final String ANON_PRINCIPAL = "airy-core-anonymous";

    public static String getUserId(Authentication authentication) {
        if (authentication == null) {
            return ANON_PRINCIPAL;
        }

        if (authentication instanceof TokenAuth) {
            return ((TokenAuth) authentication).getPrincipal();
        }

        final UserProfile userProfile = getUserProfile(authentication);
        if (userProfile == null) {
            throw new IllegalStateException("Unknown authentication type");
        }

        return userProfile.getId();
    }

    public static UserProfile getUserProfile(Authentication authentication) {
        if (authentication instanceof OAuth2AuthenticationToken) {
            return UserProfile.from((OAuth2AuthenticationToken) authentication);
        } else if (authentication instanceof AiryAuth) {
            return ((AiryAuth) authentication).getPrincipal();
        }

        return null;
    }
}

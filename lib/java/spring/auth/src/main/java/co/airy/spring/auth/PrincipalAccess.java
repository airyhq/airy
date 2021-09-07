package co.airy.spring.auth;

import co.airy.spring.auth.session.UserAuth;
import co.airy.spring.auth.session.UserProfile;
import co.airy.spring.auth.token.TokenAuth;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.stereotype.Component;

/*
  Keep this a component to allow for easy mocking in tests
 */
@Component
public class PrincipalAccess {
    public static final String ANON_PRINCIPAL = "airy-core-anonymous";

    public String getUserId(Authentication authentication) {
        if (authentication == null) {
            return ANON_PRINCIPAL;
        }

        if (authentication instanceof TokenAuth) {
            return ((TokenAuth) authentication).getPrincipal().getName();
        }

        final UserProfile userProfile = getUserProfile(authentication);
        if (userProfile == null) {
            throw new IllegalStateException("Unknown authentication type");
        }

        return userProfile.getId();
    }

    public UserProfile getUserProfile(Authentication authentication) {
        if (authentication instanceof OAuth2AuthenticationToken) {
            return UserProfile.from((OAuth2AuthenticationToken) authentication);
        } else if (authentication instanceof UserAuth) {
            return ((UserAuth) authentication).getPrincipal();
        }

        return null;
    }
}

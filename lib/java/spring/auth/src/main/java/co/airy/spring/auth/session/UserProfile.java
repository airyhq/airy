package co.airy.spring.auth.session;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.AuthenticatedPrincipal;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.oauth2.core.user.OAuth2User;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserProfile implements AuthenticatedPrincipal {
    private String id;
    private String name;
    private String avatarUrl;

    public static UserProfile from(OAuth2AuthenticationToken auth) {
        final OAuth2User user = auth.getPrincipal();

        // e.g. github:4403838
        if (user instanceof OidcUser) {
            final String id = String.format("%s:%s", auth.getAuthorizedClientRegistrationId(),
                    user.getName());
            return new UserProfile(id, ((OidcUser) user).getFullName(), ((OidcUser) user).getPicture());
        }

        final String id = String.format("%s:%s", auth.getAuthorizedClientRegistrationId(),
                user.getAttribute("id"));
        return new UserProfile(id, user.getAttribute("name"), user.getAttribute("avatar_url"));
    }
}

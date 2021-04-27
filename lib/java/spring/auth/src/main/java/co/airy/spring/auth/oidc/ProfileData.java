package co.airy.spring.auth.oidc;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.oidc.OidcUserInfo;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.oauth2.core.user.OAuth2User;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProfileData {
    private String name;
    private String avatarUrl;

    public static ProfileData from(OAuth2AuthenticationToken auth) {
        final OAuth2User user = auth.getPrincipal();
        if (user instanceof OidcUser) {
            final OidcUserInfo userInfo = ((OidcUser) user).getUserInfo();
            return new ProfileData(userInfo.getFullName(), ((OidcUser) user).getPicture());
        }

        return new ProfileData(user.getAttribute("name"), user.getAttribute("avatar_url"));
    }
}

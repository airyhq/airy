package co.airy.spring.auth.oidc;

import co.airy.spring.auth.oidc.github.EmailsResponse;
import co.airy.spring.auth.oidc.github.GithubApi;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.OAuth2ErrorCodes;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static java.util.stream.Collectors.toList;

public class UserService implements OAuth2UserService<OAuth2UserRequest, OAuth2User> {
    private final GithubApi githubApi;
    private final DefaultOAuth2UserService userService = new DefaultOAuth2UserService();

    public UserService(GithubApi githubApi) {
        this.githubApi = githubApi;
    }

    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User user = userService.loadUser(userRequest);

        // Github does not return a user's email by default
        if ("github".equals(userRequest.getClientRegistration().getRegistrationId())) {
            user = addGithubEmails(user, userRequest);
        }

        return user;
    }

    private OAuth2User addGithubEmails(OAuth2User user, OAuth2UserRequest userRequest) {
        try {
            final List<EmailsResponse> userEmails = this.githubApi.getUserEmails(userRequest.getAccessToken().getTokenValue());

            final Map<String, Object> attributes = new HashMap<>(user.getAttributes());
            attributes.put("emails", userEmails.stream().map(EmailsResponse::getEmail).collect(toList()));

            return new DefaultOAuth2User(user.getAuthorities(), attributes, userRequest.getClientRegistration().getProviderDetails().getUserInfoEndpoint()
                    .getUserNameAttributeName());
        } catch (Exception e) {
            throw new OAuth2AuthenticationException(new OAuth2Error(OAuth2ErrorCodes.INSUFFICIENT_SCOPE), e.getMessage());
        }
    }
}

package co.airy.spring.auth.oidc;

import org.springframework.security.oauth2.client.registration.ClientRegistration;
import org.springframework.security.oauth2.client.registration.ClientRegistration.Builder;
import org.springframework.security.oauth2.core.AuthorizationGrantType;
import org.springframework.security.oauth2.core.ClientAuthenticationMethod;
import org.springframework.security.oauth2.core.oidc.IdTokenClaimNames;

/**
 * Customized presets adapted from
 * org.springframework.security.config.oauth2.client.CommonOAuth2Provider
 */
public enum CommonProviders {

    GOOGLE {
        @Override
        public ClientRegistration.Builder getBuilder(String registrationId) {
            ClientRegistration.Builder builder = getBuilder(registrationId, ClientAuthenticationMethod.BASIC,
                    DEFAULT_REDIRECT_URL);
            builder.scope("openid", "profile", "email");
            builder.authorizationUri("https://accounts.google.com/o/oauth2/v2/auth");
            builder.tokenUri("https://www.googleapis.com/oauth2/v4/token");
            builder.jwkSetUri("https://www.googleapis.com/oauth2/v3/certs");
            builder.issuerUri("https://accounts.google.com");
            builder.userInfoUri("https://www.googleapis.com/oauth2/v3/userinfo");
            builder.userNameAttributeName(IdTokenClaimNames.SUB);
            builder.clientName("Google");
            return builder;
        }

    },

    GITHUB {
        @Override
        public Builder getBuilder(String registrationId) {
            ClientRegistration.Builder builder = getBuilder(registrationId, ClientAuthenticationMethod.BASIC,
                    DEFAULT_REDIRECT_URL);
            builder.scope("read:user", "user:email");
            builder.authorizationUri("https://github.com/login/oauth/authorize");
            builder.tokenUri("https://github.com/login/oauth/access_token");
            builder.userInfoUri("https://api.github.com/user");
            builder.userNameAttributeName("id");
            builder.clientName("GitHub");
            return builder;
        }

    },

    FACEBOOK {
        @Override
        public Builder getBuilder(String registrationId) {
            ClientRegistration.Builder builder = getBuilder(registrationId, ClientAuthenticationMethod.POST,
                    DEFAULT_REDIRECT_URL);
            builder.scope("public_profile", "email");
            builder.authorizationUri("https://www.facebook.com/v2.8/dialog/oauth");
            builder.tokenUri("https://graph.facebook.com/v2.8/oauth/access_token");
            builder.userInfoUri("https://graph.facebook.com/me?fields=id,name,email");
            builder.userNameAttributeName("id");
            builder.clientName("Facebook");
            return builder;
        }

    },

    OKTA {
        @Override
        public Builder getBuilder(String registrationId) {
            ClientRegistration.Builder builder = getBuilder(registrationId, ClientAuthenticationMethod.BASIC,
                    DEFAULT_REDIRECT_URL);
            builder.scope("openid", "profile", "email");
            builder.userNameAttributeName(IdTokenClaimNames.SUB);
            builder.clientName("Okta");
            return builder;
        }

    };

    public static final String DEFAULT_REDIRECT_URL = "https://{baseHost}/{action}/oauth2/code/{registrationId}";

    protected final ClientRegistration.Builder getBuilder(String registrationId, ClientAuthenticationMethod method,
                                                          String redirectUri) {
        ClientRegistration.Builder builder = ClientRegistration.withRegistrationId(registrationId);
        builder.clientAuthenticationMethod(method);
        builder.authorizationGrantType(AuthorizationGrantType.AUTHORIZATION_CODE);
        builder.redirectUri(redirectUri);
        return builder;
    }

    public abstract ClientRegistration.Builder getBuilder(String registrationId);
}

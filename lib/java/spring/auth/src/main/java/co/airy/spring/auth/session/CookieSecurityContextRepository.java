package co.airy.spring.auth.session;

import co.airy.log.AiryLoggerFactory;
import co.airy.spring.auth.Jwt;
import co.airy.spring.auth.PrincipalAccess;
import com.fasterxml.jackson.core.JsonProcessingException;
import org.slf4j.Logger;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.web.context.HttpRequestResponseHolder;
import org.springframework.security.web.context.SaveContextOnUpdateOrErrorResponseWrapper;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.web.util.WebUtils;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Optional;
import java.util.stream.Stream;

/**
 * Spring's default session store attaches a session id and stores the security context in memory.
 * <p>
 * We prefer to store the authentication state on the client, which allows us to authenticate users
 * against any Spring app without the need for them to maintain another datastore.
 */
public class CookieSecurityContextRepository implements SecurityContextRepository {
    private static final Logger log = AiryLoggerFactory.getLogger(CookieSecurityContextRepository.class);
    private final Jwt jwt;
    private final PrincipalAccess principalAccess;

    public CookieSecurityContextRepository(Jwt jwt, PrincipalAccess principalAccess) {
        this.jwt = jwt;
        this.principalAccess = principalAccess;
    }

    @Override
    public SecurityContext loadContext(HttpRequestResponseHolder requestResponseHolder) {
        HttpServletRequest request = requestResponseHolder.getRequest();
        HttpServletResponse response = requestResponseHolder.getResponse();
        requestResponseHolder.setResponse(new SaveToCookieResponseWrapper(request, response));

        SecurityContext context = SecurityContextHolder.createEmptyContext();
        getStoredAuth(request)
                .ifPresent(context::setAuthentication);

        return context;
    }

    @Override
    public void saveContext(SecurityContext context, HttpServletRequest request, HttpServletResponse response) {
        SaveToCookieResponseWrapper responseWrapper = WebUtils.getNativeResponse(response,
                SaveToCookieResponseWrapper.class);
        if (responseWrapper != null && !responseWrapper.isContextSaved()) {
            responseWrapper.saveContext(context);
        }
    }

    @Override
    public boolean containsContext(HttpServletRequest request) {
        return getStoredAuth(request).isPresent();
    }

    private Optional<Authentication> getStoredAuth(HttpServletRequest request) {
        return getCookie(request)
                .map((authCookie) -> {
                    try {
                        return jwt.loadFromToken(authCookie.getValue());
                    } catch (Exception e) {
                        log.warn("Clearing user session because token could not be decoded", e);
                        return null;
                    }
                });
    }

    private Optional<Cookie> getCookie(HttpServletRequest request) {
        if (request.getCookies() == null) {
            return Optional.empty();
        }

        return Stream.of(request.getCookies())
                .filter(c -> AuthCookie.NAME.equals(c.getName()) && !c.getValue().equals(""))
                .findFirst();
    }

    private class SaveToCookieResponseWrapper extends SaveContextOnUpdateOrErrorResponseWrapper {
        private final HttpServletRequest request;

        SaveToCookieResponseWrapper(HttpServletRequest request, HttpServletResponse response) {
            super(response, true);
            this.request = request;
        }

        @Override
        protected void saveContext(SecurityContext securityContext) {
            if (request.getMethod().equals("OPTIONS")) {
                return;
            }

            HttpServletResponse response = (HttpServletResponse) getResponse();
            Authentication authentication = securityContext.getAuthentication();

            if (authentication instanceof OAuth2AuthenticationToken) {
                try {
                    // Exchange the oauth2 session for an Airy JWT cookie session
                    final UserProfile profile = principalAccess.getUserProfile(authentication);
                    final UserAuth userAuth = new UserAuth(profile);

                    AuthCookie cookie = new AuthCookie(jwt.getAuthToken(userAuth));
                    cookie.setSecure(request.isSecure());
                    response.addCookie(cookie);
                } catch (JsonProcessingException e) {
                    throw new RuntimeException(e);
                }
            } else if (authentication == null || !authentication.isAuthenticated()) {
                // Remove the cookie if there is no auth present
                response.addCookie(new AuthCookie(""));
            }
        }
    }
}

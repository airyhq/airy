package co.airy.spring.web.filters;

import co.airy.spring.auth.PrincipalAccess;
import co.airy.spring.auth.session.UserProfile;
import co.airy.spring.web.events.HttpEventPublisher;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.util.ContentCachingRequestWrapper;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Map;
import java.util.stream.Collectors;

@Component
public class HttpLogFilter extends OncePerRequestFilter {

    private final HttpEventPublisher httpEventPublisher;
    private final PrincipalAccess principalAccess;

    private static final int MAX_JSON_LENGTH = 2048;

    public HttpLogFilter(HttpEventPublisher httpEventPublisher, PrincipalAccess principalAccess) {
        super();
        this.httpEventPublisher = httpEventPublisher;
        this.principalAccess = principalAccess;
    }

    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        boolean isFirstRequest = !this.isAsyncDispatch(request);
        HttpServletRequest requestToUse = request;
        if (isFirstRequest && !(request instanceof ContentCachingRequestWrapper)) {
            requestToUse = new ContentCachingRequestWrapper(request, MAX_JSON_LENGTH);
        }

        try {
            publishEvent(requestToUse);
        } catch (Exception e) {
            System.out.println(e.toString());
        }
        filterChain.doFilter(requestToUse, response);
    }

    private void publishEvent(HttpServletRequest request) {
        final Map<String, String> requestHeaders = getRequestHeaders((ContentCachingRequestWrapper) request);
        final String requestUri = request.getRequestURL().toString();
        String requestBody = null;

        if ("POST".equalsIgnoreCase(request.getMethod())) {
            requestBody = getRequestBody((ContentCachingRequestWrapper) request);
        }
        httpEventPublisher.publishCustomEvent(requestBody, requestHeaders, requestUri, getUser());
    }

    private UserProfile getUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return principalAccess.getUserProfile(authentication);
    }

    private Map<String, String> getRequestHeaders(ContentCachingRequestWrapper request) {
        return (new ServletServerHttpRequest(request)).getHeaders().toSingleValueMap()
                .entrySet()
                .stream()
                .map((entry) -> Map.entry(entry.getKey().toLowerCase(), entry.getValue()))
                .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
    }

    private String getRequestBody(ContentCachingRequestWrapper request) {
        final byte[] buf = request.getContentAsByteArray();
        final int bufferSize = buf.length;

        if (bufferSize == 0) {
            return null;
        }

        String payload;
        try {
            payload = new String(buf, 0, bufferSize, request.getCharacterEncoding());
        } catch (Exception e) {
            return null;
        }

        return payload;
    }
}

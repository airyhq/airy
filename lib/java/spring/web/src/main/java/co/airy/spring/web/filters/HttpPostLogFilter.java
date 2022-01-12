package co.airy.spring.web.filters;

import co.airy.spring.auth.PrincipalAccess;
import co.airy.spring.auth.session.UserProfile;
import co.airy.spring.web.events.HttpEventPublisher;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.util.ContentCachingRequestWrapper;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static java.util.stream.Collectors.toList;

@Component
public class HttpPostLogFilter extends OncePerRequestFilter {

    private final HttpEventPublisher httpEventPublisher;
    private final PrincipalAccess principalAccess;
    private final List<String> loggingIgnorePatterns;
    private final AntPathMatcher pathMatcher = new AntPathMatcher();

    private static final int MAX_JSON_LENGTH = 2048;

    public HttpPostLogFilter(HttpEventPublisher httpEventPublisher, PrincipalAccess principalAccess, List<RequestLoggingIgnorePatterns> requestLoggingIgnorePatterns) {
        super();
        this.httpEventPublisher = httpEventPublisher;
        this.principalAccess = principalAccess;
        pathMatcher.setCachePatterns(true);
        this.loggingIgnorePatterns = requestLoggingIgnorePatterns.stream().flatMap((pattern) ->
                pattern.getPatterns().stream()).collect(toList());
    }

    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        boolean isFirstRequest = !this.isAsyncDispatch(request);
        HttpServletRequest requestToUse = request;
        if (isFirstRequest && !(request instanceof ContentCachingRequestWrapper)) {
            requestToUse = new ContentCachingRequestWrapper(request, MAX_JSON_LENGTH);
        }

        try {
            if (shouldLog(request)) {
                publishEvent(requestToUse);
            }
        } catch (Exception e) {
            System.out.println(e.toString());
        }
        filterChain.doFilter(requestToUse, response);
    }

    private void publishEvent(HttpServletRequest request) {
        final Map<String, String> requestHeaders = getRequestHeaders((ContentCachingRequestWrapper) request);
        final String requestUri = request.getRequestURL().toString();
        String requestBody = getRequestBody((ContentCachingRequestWrapper) request);
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

    private boolean shouldLog(HttpServletRequest request) {
        return "POST".equalsIgnoreCase(request.getMethod())
                && !isPathIgnored(request);
    }

    private boolean isPathIgnored(HttpServletRequest request) {
        return loggingIgnorePatterns.stream().anyMatch((pattern) -> pathMatcher.match(pattern, request.getRequestURI()));
    }
}


package co.airy.spring.web.filters;

import co.airy.log.AiryLoggerFactory;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.logging.log4j.ThreadContext;
import org.slf4j.Logger;
import org.springframework.http.HttpHeaders;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.stereotype.Component;
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

@Component
public class RequestLoggingFilter extends OncePerRequestFilter {
    private static final Logger log = AiryLoggerFactory.getLogger(RequestLoggingFilter.class);
    private static final List<String> ignoredHeaders = List.of(HttpHeaders.AUTHORIZATION);
    private static final List<String> ignoredFields = List.of("password", "new_password");

    private static final int MAX_JSON_LENGTH = 2048;

    private final ObjectMapper objectMapper;

    RequestLoggingFilter(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        boolean isFirstRequest = !this.isAsyncDispatch(request);
        HttpServletRequest requestToUse = request;
        if (isFirstRequest && !(request instanceof ContentCachingRequestWrapper)) {
            requestToUse = new ContentCachingRequestWrapper(request, MAX_JSON_LENGTH);
        }

        try {
            filterChain.doFilter(requestToUse, response);
        } finally {
            if ("POST".equals(requestToUse.getMethod())) {
                log.info(createMessage(requestToUse));
            }
        }
    }

    private String createMessage(HttpServletRequest request) {
        ThreadContext.clearAll();
        ThreadContext.put("uri", request.getRequestURI());

        final Map<String, String> headerMap = (new ServletServerHttpRequest(request)).getHeaders().toSingleValueMap();

        final Map<String, String> sanitizedHeaders = headerMap.entrySet()
                .stream()
                .filter((entry) ->
                        ignoredHeaders.stream().noneMatch((ignoredHeader) -> entry.getKey().equalsIgnoreCase(ignoredHeader))
                )
                .map((entry) -> Map.entry(entry.getKey().toLowerCase(), entry.getValue()))
                .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));

        try {
            ThreadContext.put("headers", objectMapper.writeValueAsString(sanitizedHeaders));

            if (sanitizedHeaders.get("content-type").startsWith("application/json")) {
                String payload = getMessagePayload((ContentCachingRequestWrapper) request);
                ThreadContext.put("payload", payload);
            }
        } catch (Exception expected) {
        }

        return "";
    }

    private String getMessagePayload(ContentCachingRequestWrapper request) {
        final byte[] buf = request.getContentAsByteArray();
        final int bufferSize = buf.length;

        if (bufferSize == 0) {
            return null;
        }

        if (bufferSize > MAX_JSON_LENGTH) {
            return getErrorPayload("payload body exceeded \"" + MAX_JSON_LENGTH + "\" bytes.");
        }

        try {
            final String payload = new String(buf, 0, bufferSize, request.getCharacterEncoding());
            final Map jsonBody = objectMapper.readValue(payload, Map.class);

            ignoredFields.forEach((ignoredField) -> {
                if (jsonBody.containsKey(ignoredField)) {
                    jsonBody.put(ignoredField, "hidden");
                }
            });

            return objectMapper.writeValueAsString(jsonBody);
        } catch (Exception e) {
            return getErrorPayload(e.toString());
        }
    }

    private String getErrorPayload(String error) {
        try {
            return objectMapper.writeValueAsString(Map.of("error", error));
        } catch (Exception ignored) {
            return null;
        }
    }
}

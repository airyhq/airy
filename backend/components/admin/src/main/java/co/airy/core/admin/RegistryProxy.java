package co.airy.core.admin;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.retry.annotation.Retryable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import javax.servlet.http.HttpServletRequest;
import java.net.URI;
import java.util.Enumeration;

@RestController
public class RegistryProxy {
    private final String upstreamHost;
    private final int upstreamPort;
    private final RestTemplate restTemplate;

    public RegistryProxy(@Value("${KAFKA_REST_UPSTREAM_HOST}") String upstreamHost,
                         @Value("${KAFKA_REST_UPSTREAM_PORT:80}") int upstreamPort, RestTemplate restTemplate) {
        this.upstreamHost = upstreamHost;
        this.upstreamPort = upstreamPort;
        this.restTemplate = restTemplate;
    }


    @RequestMapping("/kafka/**")
    public ResponseEntity<?> proxyRequest(@RequestBody(required = false) String body, HttpMethod method, HttpServletRequest request) {
        return executeRequest(body, method, request);
    }

    @Retryable(exclude = {
            HttpStatusCodeException.class}, include = Exception.class, maxAttempts = 3)
    public ResponseEntity<?> executeRequest(String body,
                                          HttpMethod method, HttpServletRequest request) {
        String requestUrl = request.getRequestURI();

        URI uri = UriComponentsBuilder.newInstance()
                .host(upstreamHost)
                .port(upstreamPort)
                .path(requestUrl)
                .query(request.getQueryString())
                .build(true).toUri();

        HttpHeaders headers = new HttpHeaders();
        Enumeration<String> headerNames = request.getHeaderNames();

        while (headerNames.hasMoreElements()) {
            String headerName = headerNames.nextElement();
            headers.set(headerName, request.getHeader(headerName));
        }

        HttpEntity<String> httpEntity = new HttpEntity<>(body, headers);
        try {
            return restTemplate.exchange(uri, method, httpEntity, String.class);
        } catch (HttpStatusCodeException e) {
            return ResponseEntity.status(e.getRawStatusCode())
                    .headers(e.getResponseHeaders())
                    .body(e.getResponseBodyAsString());
        }
    }
}

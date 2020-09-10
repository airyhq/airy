package backend.lib.spring.web.src.main.java.co.airy.spring.web.auth;

import co.airy.spring.web.auth.interceptors.HeadersExtractorInterceptorAdapter;
import co.airy.spring.web.auth.interceptors.JwtAuthHandlerInterceptorAdapter;
import co.airy.spring.web.auth.interceptors.ThreadContextCleanupInterceptorAdapter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.handler.MappedInterceptor;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Configuration
public class AuthConfig {

    /*
    This interceptor clears the thread context which is needed because otherwise we can get stale information from a previous
    log statement. That is why it is important that it is executed first. We did not invest time to enforce the order
    by code and rely on the cleanupInterceptor being defined first within this class.
     */
    @Autowired
    private ThreadContextCleanupInterceptorAdapter cleanupInterceptorAdapter;

    @Bean
    public MappedInterceptor cleanupInterceptor() {
        return new MappedInterceptor(new String[]{"/**"}, null, cleanupInterceptorAdapter);
    }

    @Value("#{T(java.util.Arrays).asList('${auth.routes.exclude:}')}")
    private List<String> routesToExclude;

    @Autowired
    private JwtAuthHandlerInterceptorAdapter jwtAuthAdapter;

    private final List<String> defaultExclusion = List.of("/health", "/error", "/actuator/health");

    @Bean
    public MappedInterceptor authInterceptor() {
        final String[] exclusions = Stream.of(defaultExclusion, routesToExclude)
            .flatMap(List::stream).toArray(String[]::new);

        return new MappedInterceptor(null, exclusions, jwtAuthAdapter);
    }

    @Autowired
    private HeadersExtractorInterceptorAdapter headersExtractorInterceptorAdapter;

    @Bean
    public MappedInterceptor headersInterceptor() {
        return new MappedInterceptor(null, new String[]{"/health", "/error", "/actuator/health", "/ws", "/self-ws"}, headersExtractorInterceptorAdapter);
    }
}

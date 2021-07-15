package co.airy.spring.web.filters;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class RequestLoggingConfig {

    @Bean(name = "defaultIgnorePatterns")
    public RequestLoggingIgnorePatterns requestLoggingIgnorePatterns() {
        return new RequestLoggingIgnorePatterns(List.of("/actuator/**"));
    }
}

package co.airy.spring.web.filters;

import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class RequestLoggingConfig {

    @ConditionalOnMissingBean
    @Bean
    public RequestLoggingIgnorePatterns requestLoggingIgnorePatterns() {
        return new RequestLoggingIgnorePatterns(List.of());
    }
}

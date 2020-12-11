package co.airy.spring.auth;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;

import java.util.Arrays;
import java.util.List;

@Configuration
public class AllowedOriginsConfig {
    @Bean
    @Qualifier("allowedOrigins")
    List<String> allowedOrigins(final Environment environment) {
        final String allowed = environment.getProperty("ALLOWED_ORIGINS", "");
        return Arrays.asList(allowed.split(","));
    }
}

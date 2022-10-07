package co.airy.core.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.web.client.RestTemplate;

@EnableScheduling
@Configuration
public class ClientControllerConfig {
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}

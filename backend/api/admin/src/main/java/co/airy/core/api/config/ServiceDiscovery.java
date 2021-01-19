package co.airy.core.api.config;

import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Component
public class ServiceDiscovery {
    private static final List<String> services = List.of(
            "sources-chatplugin",
            "sources-facebook-connector",
            "sources-twilio-connector",
            "sources-google-connector"
    );

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }

    public List<String> getServices() {
        return services;
    }
}

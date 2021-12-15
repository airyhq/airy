package co.airy.spring.test;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
import org.springframework.test.web.servlet.MockMvc;

@Configuration
public class WebTestHelperConfig {

    @Bean
    @Lazy
    public WebTestHelper webTestHelper(MockMvc mvc, @Value("${systemToken:#{null}}") String systemToken) {
        return new WebTestHelper(mvc, systemToken);
    }
}

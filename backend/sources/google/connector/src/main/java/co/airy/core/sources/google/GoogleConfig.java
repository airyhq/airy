package co.airy.core.sources.google;

import co.airy.core.sources.google.model.GoogleServiceAccount;
import co.airy.log.AiryLoggerFactory;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GoogleConfig {
    private static final Logger log = AiryLoggerFactory.getLogger(GoogleConfig.class);

    final ObjectMapper objectMapper;

    public GoogleConfig(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @Bean
    public GoogleServiceAccount googleServiceAccount(@Value("${google.auth.sa}") String googleServiceAccountFile) {
        try {
            return objectMapper.readValue(googleServiceAccountFile, GoogleServiceAccount.class);
        } catch (JsonProcessingException e) {
            log.error("Failed to parse credentials" + e.getMessage());
            throw new IllegalStateException(e);
        }
    }
}

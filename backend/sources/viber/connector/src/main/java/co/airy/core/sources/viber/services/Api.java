package co.airy.core.sources.viber.services;

import co.airy.core.sources.viber.dto.AccountInfo;
import co.airy.log.AiryLoggerFactory;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.viber.bot.api.ApiResponse;
import com.viber.bot.api.ViberBot;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class Api {
    private final Logger log = AiryLoggerFactory.getLogger(Api.class);
    private static final String API_URL = "https://chatapi.viber.com/pa";

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final HttpHeaders authHeaders;

    public Api(@Value("${authToken}") String authToken) {
        authHeaders = new HttpHeaders();
        authHeaders.set("X-Viber-Auth-Token", authToken);
    }

    @Bean
    AccountInfo accountInfo() {
        try {
            final String apiResponse = getApiResponse("/get_account_info", null);
            return objectMapper.readValue(apiResponse, AccountInfo.class);
        } catch (Exception e) {
            log.error("Could not fetch required account info using get_account_info and the provided viber.auth-token");
            throw new RuntimeException(e);
        }
    }

    private String getApiResponse(String path, @Nullable String postData) {
        final HttpEntity<String> request = new HttpEntity<>(postData, authHeaders);
        return restTemplate.postForObject(String.format("%s%s", API_URL, path), request, String.class);
    }
}

package co.airy.core.sources.viber.services;

import co.airy.core.sources.viber.dto.AccountInfo;
import co.airy.core.sources.viber.dto.SendMessageResponse;
import co.airy.log.AiryLoggerFactory;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.viber.bot.profile.BotProfile;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.ApplicationListener;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.client.ClientHttpResponse;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Component;
import org.springframework.web.client.ResponseErrorHandler;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Component
public class Api implements ApplicationListener<ApplicationReadyEvent>  {
    private final Logger log = AiryLoggerFactory.getLogger(Api.class);
    private static final String API_URL = "https://chatapi.viber.com/pa";

    private RestTemplate restTemplate;
    private final RestTemplateBuilder restTemplateBuilder;
    private final ObjectMapper objectMapper;
    private final HttpHeaders authHeaders;

    public Api(RestTemplateBuilder restTemplateBuilder, @Value("${authToken}") String authToken, @Qualifier("viberObjectMapper") ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
        this.restTemplateBuilder = restTemplateBuilder;
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

    public SendMessageResponse sendMessage(String receiver, BotProfile sender, String content) throws JsonProcessingException {
        final ObjectNode payload = (ObjectNode) objectMapper.readTree(content);

        final ObjectNode senderPayload = JsonNodeFactory.instance.objectNode();
        senderPayload.put("name", sender.getName());
        if (sender.getAvatar() != null) {
            senderPayload.put("avatar", sender.getAvatar());
        }

        payload.set("sender", senderPayload);
        payload.put("receiver", receiver);

        final String response = getApiResponse("/send_message", payload.toString());
        return objectMapper.readValue(response, SendMessageResponse.class);
    }

    public void setWebhook(String webhookUrl) throws Exception {
        Map<String, Object> request = new HashMap<>() {{
            put("url", webhookUrl);
            put("send_name", true);
            put("send_photo", true);
        }};

        getApiResponse("/set_webhook", objectMapper.writeValueAsString(request));
    }

    public void removeWebhook() throws Exception {
        getApiResponse("/set_webhook", objectMapper.writeValueAsString(Map.of("url", "")));
    }


    @Override
    public void onApplicationEvent(ApplicationReadyEvent event) {
        restTemplate = restTemplateBuilder
                .errorHandler(new ResponseErrorHandler() {
                    @Override
                    public boolean hasError(ClientHttpResponse response) throws IOException {
                        return response.getRawStatusCode() != HttpStatus.OK.value();
                    }

                    @Override
                    public void handleError(ClientHttpResponse response) throws IOException {
                        final String errorPayload = new String(response.getBody().readAllBytes());
                        final int statusCode = response.getRawStatusCode();

                        final JsonNode jsonNode = objectMapper.readTree(errorPayload);
                        final String errorMessage = Optional.of(jsonNode.get("status_message"))
                                .map(JsonNode::textValue)
                                .orElseGet(() -> {
                                    log.warn("Could not parse error message from response: {}", errorPayload);
                                    return String.format("Api replied with status code %s and payload %s", statusCode, errorPayload);
                                });
                        throw new ApiException(errorMessage, errorPayload);
                    }
                })
                .build();
    }

}

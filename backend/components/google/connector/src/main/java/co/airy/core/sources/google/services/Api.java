package co.airy.core.sources.google.services;

import co.airy.core.sources.google.ApiException;
import co.airy.core.sources.google.model.GoogleServiceAccount;
import co.airy.log.AiryLoggerFactory;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.auth.oauth2.AccessToken;
import com.google.auth.oauth2.GoogleCredentials;
import org.slf4j.Logger;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.ApplicationListener;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.client.ClientHttpResponse;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.stereotype.Service;
import org.springframework.web.client.ResponseErrorHandler;
import org.springframework.web.client.RestTemplate;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Service
public class Api implements ApplicationListener<ApplicationReadyEvent> {
    private static final Logger log = AiryLoggerFactory.getLogger(Api.class);
    final RestTemplateBuilder restTemplateBuilder;
    final ObjectMapper objectMapper;
    final GoogleServiceAccount serviceAccount;

    private RestTemplate restTemplate;
    private static final String requestTemplate = "https://businessmessages.googleapis.com/v1/conversations/%s/messages";

    public Api(RestTemplateBuilder restTemplateBuilder, ObjectMapper objectMapper, GoogleServiceAccount serviceAccount) {
        this.restTemplateBuilder = restTemplateBuilder;
        this.objectMapper = objectMapper;
        this.serviceAccount = serviceAccount;
    }

    public void sendMessage(final String conversationId, JsonNode sendMessagePayload) throws Exception {
        String reqUrl = String.format(requestTemplate, conversationId);

        final byte[] serializedServiceAccount = objectMapper.writeValueAsString(serviceAccount).getBytes();
        GoogleCredentials credentials = GoogleCredentials.fromStream(new ByteArrayInputStream(serializedServiceAccount))
                .createScoped(List.of("https://www.googleapis.com/auth/businessmessages"));
        credentials.refreshIfExpired();
        AccessToken token = credentials.getAccessToken();

        restTemplate.postForEntity(reqUrl,
                new HttpEntity<>(sendMessagePayload, getHeaders(token.getTokenValue())),
                String.class);
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
                        final String errorMessage = Optional.of(jsonNode.get("error"))
                                .map((node) -> node.get("message"))
                                .map(JsonNode::textValue)
                                .orElseGet(() -> {
                                    log.warn("Could not parse error message from response: {}", errorPayload);
                                    return String.format("Api replied with status code %s and payload %s", statusCode, errorPayload);
                                });
                        throw new ApiException(errorMessage, errorPayload);
                    }
                })
                .additionalMessageConverters(new MappingJackson2HttpMessageConverter(objectMapper))
                .build();
    }

    private HttpHeaders getHeaders(final String jwtToken) {
        final HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.setContentType(MediaType.APPLICATION_JSON);
        httpHeaders.setBearerAuth(jwtToken);
        return httpHeaders;
    }
}

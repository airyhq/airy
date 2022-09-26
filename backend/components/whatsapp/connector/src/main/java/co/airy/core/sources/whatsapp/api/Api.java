package co.airy.core.sources.whatsapp.api;

import co.airy.avro.communication.Channel;
import co.airy.core.sources.whatsapp.api.model.LongLivingUserAccessToken;
import co.airy.core.sources.whatsapp.api.model.SendMessageResponse;
import co.airy.core.sources.whatsapp.dto.SendMessageRequest;
import co.airy.log.AiryLoggerFactory;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.ApplicationListener;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.ClientHttpResponse;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.stereotype.Service;
import org.springframework.web.client.ResponseErrorHandler;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.util.Optional;

/*
  @see https://developers.whatsapp.com/docs/messenger-platform/reference/send-api/
 */
@Service
public class Api implements ApplicationListener<ApplicationReadyEvent> {
    private static final Logger log = AiryLoggerFactory.getLogger(Api.class);
    private final RestTemplateBuilder restTemplateBuilder;
    private final ObjectMapper objectMapper;
    private final Mapper mapper;
    private RestTemplate restTemplate;

    private static final String baseUrl = "https://graph.facebook.com/v14.0";
    private static final String messageTemplate = baseUrl + "/%s/messages?access_token=%s";

    private final HttpHeaders httpHeaders = new HttpHeaders();
    private final String appId;
    private final String appSecret;

    public Api(RestTemplateBuilder restTemplateBuilder,
               Mapper mapper,
               @Value("${appId}") String appId,
               @Value("${appSecret}") String appSecret,
               @Qualifier("metaObjectMapper") ObjectMapper objectMapper) {
        this.mapper = mapper;
        httpHeaders.setContentType(MediaType.APPLICATION_JSON);
        this.restTemplateBuilder = restTemplateBuilder;
        this.appId = appId;
        this.appSecret = appSecret;
        this.objectMapper = objectMapper;
    }

    private <T> T apiResponse(String url, HttpMethod method, Class<T> clazz) throws Exception {
        ResponseEntity<String> responseEntity = restTemplate.exchange(url, method, null, String.class);
        return objectMapper.readValue(responseEntity.getBody(), clazz);
    }

    public String exchangeToLongLivingUserAccessToken(String userAccessToken) throws Exception {
        String apiUrl = String.format(baseUrl + "/oauth/access_token?grant_type=fb_exchange_token&client_id=%s&client_secret=%s&fb_exchange_token=%s", appId, appSecret, userAccessToken);
        return apiResponse(apiUrl, HttpMethod.GET, LongLivingUserAccessToken.class).getAccessToken();
    }

    public SendMessageResponse sendMessage(SendMessageRequest sendMessageRequest) throws JsonProcessingException {
        final String token = sendMessageRequest.getConversation().getChannel().getToken();
        final String phoneNumberId = sendMessageRequest.getConversation().getChannel().getSourceChannelId();
        final JsonNode payload = mapper.getSendMessageRequest(sendMessageRequest);
        String reqUrl = String.format("%s/%s/messages?access_token=%s", baseUrl, phoneNumberId, token);

        final ResponseEntity<SendMessageResponse> responseEntity = restTemplate.postForEntity(reqUrl, new HttpEntity<>(payload, httpHeaders), SendMessageResponse.class);
        return responseEntity.getBody();
    }

    public void markMessageRead(String whatsappMessageId, Channel channel) {
        final String token = channel.getToken();
        final String phoneNumberId = channel.getSourceChannelId();
        final JsonNode payload = mapper.getMarkMessageReadRequest(whatsappMessageId);
        String reqUrl = String.format("%s/%s/messages?access_token=%s", baseUrl, phoneNumberId, token);
        restTemplate.postForEntity(reqUrl, new HttpEntity<>(payload, httpHeaders), SendMessageResponse.class);
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
}


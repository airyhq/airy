package co.airy.core.sources.whatsapp.api;

import co.airy.core.sources.whatsapp.api.model.LongLivingUserAccessToken;
import co.airy.log.AiryLoggerFactory;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.PropertyNamingStrategy;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.ApplicationListener;
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
    private RestTemplate restTemplate;

    private static final String subscribedFields = "messages,messaging_postbacks,messaging_optins,message_deliveries,message_reads,messaging_payments,messaging_pre_checkouts,messaging_checkout_updates,messaging_account_linking,messaging_referrals,message_echoes,messaging_game_plays,standby,messaging_handovers,messaging_policy_enforcement,message_reactions,inbox_labels,message_reactions";
    private static final String baseUrl = "https://graph.facebook.com/v11.0";
    private static final String requestTemplate = baseUrl + "/me/messages?access_token=%s";
    private final String pageFields = "fields=id,name_with_location_descriptor,access_token,picture,is_webhooks_subscribed";

    private final HttpHeaders httpHeaders = new HttpHeaders();
    private final String appId;
    private final String appSecret;

    public Api(RestTemplateBuilder restTemplateBuilder,
               @Value("${appId}") String appId,
               @Value("${appSecret}") String appSecret) {
        httpHeaders.setContentType(MediaType.APPLICATION_JSON);
        this.objectMapper = new ObjectMapper()
                .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false)
                .configure(DeserializationFeature.FAIL_ON_MISSING_EXTERNAL_TYPE_ID_PROPERTY, false)
                .setPropertyNamingStrategy(PropertyNamingStrategy.SNAKE_CASE);
        this.restTemplateBuilder = restTemplateBuilder;
        this.appId = appId;
        this.appSecret = appSecret;
    }
    private <T> T apiResponse(String url, HttpMethod method, Class<T> clazz) throws Exception {
        ResponseEntity<String> responseEntity = restTemplate.exchange(url, method, null, String.class);
        return objectMapper.readValue(responseEntity.getBody(), clazz);
    }

    public String exchangeToLongLivingUserAccessToken(String userAccessToken) throws Exception {
        String apiUrl = String.format(baseUrl + "/oauth/access_token?grant_type=fb_exchange_token&client_id=%s&client_secret=%s&fb_exchange_token=%s", appId, appSecret, userAccessToken);
        return apiResponse(apiUrl, HttpMethod.GET, LongLivingUserAccessToken.class).getAccessToken();
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


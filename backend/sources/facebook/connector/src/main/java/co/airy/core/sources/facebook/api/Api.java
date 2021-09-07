package co.airy.core.sources.facebook.api;

import co.airy.core.sources.facebook.api.model.InstagramProfile;
import co.airy.core.sources.facebook.api.model.LongLivingUserAccessToken;
import co.airy.core.sources.facebook.api.model.PageWithConnectInfo;
import co.airy.core.sources.facebook.api.model.Pages;
import co.airy.core.sources.facebook.api.model.Participants;
import co.airy.core.sources.facebook.api.model.SendMessagePayload;
import co.airy.core.sources.facebook.api.model.SendMessageResponse;
import co.airy.core.sources.facebook.api.model.UserProfile;
import com.fasterxml.jackson.databind.ObjectMapper;
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
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/*
  @see https://developers.facebook.com/docs/messenger-platform/reference/send-api/
 */
@Service
public class Api implements ApplicationListener<ApplicationReadyEvent> {
    private final RestTemplateBuilder restTemplateBuilder;
    private final ObjectMapper objectMapper;
    private RestTemplate restTemplate;

    private static final String subscribedFields = "messages,messaging_postbacks,messaging_optins,message_deliveries,message_reads,messaging_payments,messaging_pre_checkouts,messaging_checkout_updates,messaging_account_linking,messaging_referrals,message_echoes,messaging_game_plays,standby,messaging_handovers,messaging_policy_enforcement,message_reactions,inbox_labels,message_reactions";
    private static final String baseUrl = "https://graph.facebook.com/v11.0";
    private static final String requestTemplate = baseUrl + "/me/messages?access_token=%s";
    private final String pageFields = "fields=id,name_with_location_descriptor,access_token,picture,is_webhooks_subscribed";

    private final HttpHeaders httpHeaders = new HttpHeaders();
    private final String appId;
    private final String apiSecret;
    private static final String errorMessageTemplate =
            "Exception while sending a message to Facebook: \n" +
                    "Http Status Code: %s \n" +
                    "Error Message: %s \n";

    public Api(ObjectMapper objectMapper, RestTemplateBuilder restTemplateBuilder,
               @Value("${facebook.app-id}") String appId,
               @Value("${facebook.app-secret}") String apiSecret) {
        httpHeaders.setContentType(MediaType.APPLICATION_JSON);
        this.objectMapper = objectMapper;
        this.restTemplateBuilder = restTemplateBuilder;
        this.appId = appId;
        this.apiSecret = apiSecret;
    }

    public SendMessageResponse sendMessage(final String pageToken, SendMessagePayload sendMessagePayload) {
        String reqUrl = String.format(requestTemplate, pageToken);
        final ResponseEntity<SendMessageResponse> responseEntity = restTemplate.postForEntity(reqUrl, new HttpEntity<>(sendMessagePayload, httpHeaders), SendMessageResponse.class);
        return responseEntity.getBody();
    }

    public List<PageWithConnectInfo> getPagesInfo(String accessToken) throws Exception {
        String pagesUrl = String.format(baseUrl + "/me/accounts?%s&access_token=%s", pageFields, accessToken);

        boolean hasMorePages = true;
        List<PageWithConnectInfo> pageList = new ArrayList<>();
        while (hasMorePages) {
            Pages pages = apiResponse(pagesUrl, HttpMethod.GET, Pages.class);
            if (pages.getPaging() != null && pages.getPaging().getNext() != null) {
                pagesUrl = URLDecoder.decode(pages.getPaging().getNext(), StandardCharsets.UTF_8);
            } else {
                hasMorePages = false;
            }
            pageList.addAll(pages.getData());
        }
        return pageList;
    }

    private <T> T apiResponse(String url, HttpMethod method, Class<T> clazz) throws Exception {
        ResponseEntity<String> responseEntity = restTemplate.exchange(url, method, null, String.class);
        return objectMapper.readValue(responseEntity.getBody(), clazz);
    }

    // https://developers.facebook.com/docs/messenger-platform/instagram/features/user-profile
    public UserProfile getInstagramProfile(String sourceConversationId, String token) {
        ResponseEntity<InstagramProfile> responseEntity = restTemplate.getForEntity(baseUrl + "/{ig-id}?fields=name,profile_pic&access_token={access_token}",
                InstagramProfile.class, sourceConversationId, token);
        if (responseEntity.getStatusCode() != HttpStatus.OK) {
            throw new ApiException("Call unsuccessful, received HTTP status " + responseEntity.getStatusCodeValue());
        }
        return Optional.ofNullable(responseEntity.getBody())
                .map((body) -> UserProfile.builder().firstName(body.getName()).profilePic(body.getProfilePic()).build())
                .orElseThrow();
    }


    // See "Retrieving a Person's Profile" in https://developers.facebook.com/docs/messenger-platform/identity/user-profile
    public UserProfile getProfileFromContact(String sourceConversationId, String token) {
        String reqUrl = String.format(baseUrl + "/%s?fields=first_name,last_name,profile_pic&access_token=%s",
                sourceConversationId, token);
        ResponseEntity<UserProfile> responseEntity = restTemplate.getForEntity(reqUrl, UserProfile.class);
        if (responseEntity.getStatusCode() != HttpStatus.OK) {
            throw new ApiException("Call unsuccessful, received HTTP status " + responseEntity.getStatusCodeValue());
        }
        return responseEntity.getBody();
    }

    // See https://developers.facebook.com/docs/graph-api/reference/v9.0/conversation#edges
    public UserProfile getProfileFromParticipants(String sourceConversationId, String token) {
        String reqUrl = String.format(baseUrl + "/me/conversations?user_id=%s&fields=participants&access_token=%s",
                sourceConversationId, token);

        ResponseEntity<Participants> responseEntity = restTemplate.getForEntity(reqUrl, Participants.class);
        if (responseEntity.getBody() == null || responseEntity.getStatusCode() != HttpStatus.OK) {
            throw new ApiException("Call unsuccessful");
        }

        return fromParticipants(responseEntity.getBody(), sourceConversationId);
    }

    public PageWithConnectInfo getPageForUser(final String pageId, final String accessToken) throws Exception {
        final String pageUrl = String.format(baseUrl + "/%s?%s&access_token=%s", pageId, pageFields, accessToken);

        return apiResponse(pageUrl, HttpMethod.GET, PageWithConnectInfo.class);
    }

    public void connectPageToApp(String pageToken) throws Exception {
        String apiUrl = String.format(baseUrl + "/me/subscribed_apps?access_token=%s&subscribed_fields=%s", pageToken, subscribedFields);
        apiResponse(apiUrl, HttpMethod.POST, Map.class);
    }

    public String exchangeToLongLivingUserAccessToken(String userAccessToken) throws Exception {
        String apiUrl = String.format(baseUrl + "/oauth/access_token?grant_type=fb_exchange_token&client_id=%s&client_secret=%s&fb_exchange_token=%s", appId, apiSecret, userAccessToken);
        return apiResponse(apiUrl, HttpMethod.GET, LongLivingUserAccessToken.class).getAccessToken();
    }

    private UserProfile fromParticipants(Participants participants, String psId) {
        return participants.getData()
                .get(0)
                .getParticipants()
                .getData()
                .stream()
                .filter((participantEntry -> psId.equals(participantEntry.getId())))
                .map((userParticipant) -> {
                    final String name = userParticipant.getName();
                    final List<String> splits = new ArrayList<>(Arrays.asList(name.split(" ")));

                    final String firstName = splits.get(0);
                    splits.remove(0);
                    String lastName = String.join(" ", splits);

                    return UserProfile.builder().firstName(firstName).lastName(lastName).build();
                })
                .findFirst()
                .get();
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
                        throw new ApiException(String.format(errorMessageTemplate, response.getRawStatusCode(), new String(response.getBody().readAllBytes())));
                    }
                })
                .additionalMessageConverters(new MappingJackson2HttpMessageConverter(objectMapper))
                .build();
    }
}

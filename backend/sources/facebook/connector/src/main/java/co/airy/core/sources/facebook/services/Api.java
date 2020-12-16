package co.airy.core.sources.facebook.services;

import co.airy.avro.communication.Channel;
import co.airy.core.sources.facebook.ApiException;
import co.airy.core.sources.facebook.model.Participants;
import co.airy.core.sources.facebook.model.SendMessagePayload;
import co.airy.core.sources.facebook.model.UserProfile;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.ApplicationListener;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.ClientHttpResponse;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.stereotype.Service;
import org.springframework.web.client.ResponseErrorHandler;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/*
  @see https://developers.facebook.com/docs/messenger-platform/reference/send-api/
 */
@Service
public class Api implements ApplicationListener<ApplicationReadyEvent> {
    private final RestTemplateBuilder restTemplateBuilder;
    private final ObjectMapper objectMapper;

    private RestTemplate restTemplate;

    private static final String requestTemplate = "https://graph.facebook.com/v3.2/me/messages?access_token=%s";

    private final HttpHeaders httpHeaders = new HttpHeaders();

    private static final String errorMessageTemplate =
            "Exception while sending a message to Facebook: \n" +
                    "Http Status Code: %s \n" +
                    "Error Message: %s \n";

    public Api(ObjectMapper objectMapper, RestTemplateBuilder restTemplateBuilder) {
        httpHeaders.setContentType(MediaType.APPLICATION_JSON);
        this.objectMapper = objectMapper;
        this.restTemplateBuilder = restTemplateBuilder;
    }


    public void sendMessage(final String pageToken, SendMessagePayload sendMessagePayload) {
        String fbReqUrl = String.format(requestTemplate, pageToken);

        restTemplate.postForEntity(fbReqUrl, new HttpEntity<>(sendMessagePayload, httpHeaders), FbSendMessageResponse.class);
    }

    // See "Retrieving a Person's Profile" in https://developers.facebook.com/docs/messenger-platform/identity/user-profile
    public UserProfile getProfileFromContact(String sourceConversationId, String token) {
        String reqUrl = String.format("https://graph.facebook.com/v3.2/%s?fields=first_name,last_name,profile_pic&access_token=%s",
                sourceConversationId, token);
        ResponseEntity<UserProfile> responseEntity = restTemplate.getForEntity(reqUrl, UserProfile.class);
        if (responseEntity.getStatusCode() != HttpStatus.OK) {
            throw new ApiException("Call unsuccessful, received HTTP status " + responseEntity.getStatusCodeValue());
        }
        return responseEntity.getBody();
    }

    // See https://developers.facebook.com/docs/graph-api/reference/v9.0/conversation#edges
    public UserProfile getProfileFromParticipants(String sourceConversationId, String token) {
        String reqUrl = String.format("https://graph.facebook.com/v9.0/me/conversations?user_id=%s&fields=participants&access_token=%s",
                sourceConversationId, token);

        ResponseEntity<Participants> responseEntity = restTemplate.getForEntity(reqUrl, Participants.class);
        if (responseEntity.getStatusCode() != HttpStatus.OK) {
            throw new ApiException("Call unsuccessful, received HTTP status " + responseEntity.getStatusCodeValue());
        }

        return fromParticipants(responseEntity.getBody(), sourceConversationId);
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

                    return UserProfile.builder()
                            .firstName(firstName)
                            .lastName(lastName)
                            .build();
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

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    private static class FbSendMessageResponse {
        @JsonProperty("recipient_id")
        private String recipientId;

        @JsonProperty("message_id")
        private String messageId;
    }
}

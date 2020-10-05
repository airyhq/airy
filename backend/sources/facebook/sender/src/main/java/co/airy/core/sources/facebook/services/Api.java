package co.airy.core.sources.facebook.services;

import co.airy.core.sources.facebook.ApiException;
import co.airy.core.sources.facebook.model.SendMessagePayload;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
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

import java.io.IOException;

/*
  @see https://developers.facebook.com/docs/messenger-platform/reference/send-api/
 */
@Service
public class Api implements ApplicationListener<ApplicationReadyEvent> {
    @Autowired
    RestTemplateBuilder restTemplateBuilder;

    @Autowired
    private ObjectMapper objectMapper;

    private RestTemplate restTemplate;

    private static final String requestTemplate = "https://graph.facebook.com/v3.2/me/messages?access_token=%s";

    private final HttpHeaders httpHeaders = new HttpHeaders();

    private static final String errorMessageTemplate =
            "Exception while sending a message to Facebook: \n" +
                    "Http Status Code: %s \n" +
                    "Error Message: %s \n";

    public Api() {
        httpHeaders.setContentType(MediaType.APPLICATION_JSON);
    }


    public void sendMessage(final String pageToken, SendMessagePayload fbSendMessagePayload) {
        String fbReqUrl = String.format(requestTemplate, pageToken);

        restTemplate.postForEntity(fbReqUrl, new HttpEntity<>(fbSendMessagePayload, httpHeaders), FbSendMessageResponse.class);
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
        private String recipient_id;

        @JsonProperty("message_id")
        private String message_id;
    }
}

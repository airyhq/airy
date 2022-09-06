package co.airy.core.sources.api.actions;

import co.airy.core.sources.api.actions.payload.ErrorResponsePayload;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.http.client.ClientHttpResponse;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.web.client.ResponseErrorHandler;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;

@Configuration
public class EndpointConfig {
    @Bean
    public RestTemplate restTemplate(RestTemplateBuilder restTemplateBuilder, ObjectMapper objectMapper) {
        return restTemplateBuilder
                .errorHandler(new ResponseErrorHandler() {
                    @Override
                    public boolean hasError(ClientHttpResponse response) throws IOException {
                        return response.getRawStatusCode() != HttpStatus.OK.value();
                    }

                    @Override
                    public void handleError(ClientHttpResponse response) throws IOException {
                        final String responseContent = new String(response.getBody().readAllBytes());
                        String errorMessage;
                        try {
                            final ErrorResponsePayload payload = objectMapper.readValue(responseContent, ErrorResponsePayload.class);
                            errorMessage = payload.getError();
                        } catch (Exception e) {
                            errorMessage = String.format("Action endpoint returned invalid error: %s", e);
                        }

                        throw new ApiException(errorMessage);
                    }
                })
                .additionalMessageConverters(new MappingJackson2HttpMessageConverter(objectMapper))
                .build();
    }
}

package co.airy.core.sources.api.actions;

import co.airy.avro.communication.Source;
import co.airy.core.sources.api.actions.dto.SendMessage;
import co.airy.core.sources.api.actions.payload.SendMessageRequestPayload;
import co.airy.core.sources.api.actions.payload.SendMessageResponsePayload;
import co.airy.crypto.Signature;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.net.URI;

import static co.airy.crypto.Signature.getSignature;
import static org.springframework.http.HttpHeaders.CONTENT_TYPE;
import static org.springframework.http.MediaType.APPLICATION_JSON;

@Service
public class Endpoint {
    private final ObjectMapper objectMapper;
    private final RestTemplate restTemplate;

    public Endpoint(RestTemplate restTemplate, ObjectMapper objectMapper) {
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
    }

    public SendMessageResponsePayload sendMessage(SendMessage request) throws Exception {
        final SendMessageRequestPayload requestPayload = SendMessageRequestPayload.fromSendMessage(request);
        final String responseContent = sendRequest(requestPayload, request.getSource());
        return objectMapper.readValue(responseContent, SendMessageResponsePayload.class);
    }

    private String sendRequest(Object payload, Source source) throws Exception {
        final String content = objectMapper.writeValueAsString(payload);
        final HttpHeaders headers = new HttpHeaders();
        headers.set(CONTENT_TYPE, APPLICATION_JSON.toString());
        final String signature = getSignature(source.getToken(), content);
        headers.set(Signature.CONTENT_SIGNATURE_HEADER, signature);

        final HttpEntity<String> entity = new HttpEntity<>(content, headers);
        return restTemplate.postForObject(new URI(source.getActionEndpoint()), entity, String.class);
    }
}

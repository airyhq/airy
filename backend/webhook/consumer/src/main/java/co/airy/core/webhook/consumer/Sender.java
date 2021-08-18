package co.airy.core.webhook.consumer;

import co.airy.avro.communication.Webhook;
import co.airy.core.webhook.WebhookEvent;
import co.airy.log.AiryLoggerFactory;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.net.URI;
import java.net.URISyntaxException;
import java.security.InvalidKeyException;

import static co.airy.core.webhook.WebhookEvent.shouldSendFor;

@Component
public class Sender {
    private static final Logger log = AiryLoggerFactory.getLogger(Sender.class);
    private final RestTemplate restTemplate;
    private final Stores stores;
    private final ObjectMapper objectMapper;
    private final Signature signature;

    public static final String CONTENT_SIGNATURE_HEADER = "X-Airy-Content-Signature";

    public Sender(RestTemplate restTemplate, Stores stores, ObjectMapper objectMapper, Signature signature) {
        this.restTemplate = restTemplate;
        this.stores = stores;
        this.objectMapper = objectMapper;
        this.signature = signature;
    }

    public void sendRecord(WebhookEvent event) {
        // TODO
        final Webhook webhook = stores.getWebhook(event.getWebhookId());
        if (!shouldSendFor(event.getPayload(), webhook)) {
            return;
        }

        final HttpHeaders headers = getDefaultHeaders();
        webhook.getHeaders().forEach(headers::set);

        try {
            final String content = objectMapper.writeValueAsString(event.getPayload());
            if (webhook.getSignKey() != null) {
                final String contentSignature = this.signature.getSignature(webhook.getSignKey(), content);
                headers.set(CONTENT_SIGNATURE_HEADER, contentSignature);
            }

            final HttpEntity<String> entity = new HttpEntity<>(content, headers);
            restTemplate.postForEntity(new URI(webhook.getEndpoint()), entity, String.class);
        } catch (InvalidKeyException e) {
            // TODO Send error as metadata to webhook and render in UI
            log.error("User provided webhook key has an invalid signature. Skipping. Webhook id: {}", webhook.getId(), e);
        } catch (JsonProcessingException e) {
            log.error("Failed to serialize webhook event payload. Exiting. {}", event, e);
            throw new RuntimeException(e);
        } catch (URISyntaxException e) {
            log.error("Malformed webhook url. Exiting. {}", event, e);
            e.printStackTrace();
        }
    }

    private HttpHeaders getDefaultHeaders() {
        final HttpHeaders headers = new HttpHeaders();
        headers.set("User-Agent", "Airy/1.0");
        headers.setContentType(MediaType.APPLICATION_JSON);
        return headers;
    }
}

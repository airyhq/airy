package co.airy.core.api.admin;

import co.airy.avro.communication.Status;
import co.airy.avro.communication.Webhook;
import co.airy.core.api.admin.payload.GetWebhookResponse;
import co.airy.core.api.admin.payload.WebhookSubscriptionPayload;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ExecutionException;

@RestController
public class WebhooksController {
    private final Stores stores;

    public WebhooksController(Stores stores) {
        this.stores = stores;
    }

    @PostMapping("/webhooks.subscribe")
    public ResponseEntity<?> subscribe(@RequestBody @Valid WebhookSubscriptionPayload payload) {
        final String apiSecret = Optional.ofNullable(stores.getWebhook())
                .map(Webhook::getApiSecret)
                .orElse(UUID.randomUUID().toString());

        final Webhook webhook = Webhook.newBuilder()
                .setApiSecret(apiSecret)
                .setId(UUID.randomUUID().toString())
                .setEndpoint(payload.getUrl())
                .setStatus(Status.Subscribed)
                .setHeaders(payload.getHeaders())
                .build();

        try {
            stores.storeWebhook(webhook);
        } catch (InterruptedException | ExecutionException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }

        final GetWebhookResponse webhookResponse = GetWebhookResponse.builder()
                .headers(webhook.getHeaders())
                .apiSecret(apiSecret)
                .status(webhook.getStatus().toString())
                .url(webhook.getEndpoint())
                .build();

        return ResponseEntity.status(HttpStatus.OK).body(webhookResponse);
    }

    @PostMapping("/webhooks.unsubscribe")
    public ResponseEntity<?> unsubscribe() {
        Webhook webhook = stores.getWebhook();

        if (webhook == null) {
            return ResponseEntity.ok().build();
        }

        webhook.setStatus(Status.Unsubscribed);

        try {
            stores.storeWebhook(webhook);
        } catch (InterruptedException | ExecutionException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }

        final GetWebhookResponse webhookResponse = GetWebhookResponse.builder()
                .headers(webhook.getHeaders())
                .apiSecret(webhook.getApiSecret())
                .status(webhook.getStatus().toString())
                .url(webhook.getEndpoint())
                .build();

        return ResponseEntity.status(HttpStatus.OK).body(webhookResponse);
    }

    @PostMapping("/webhooks.info")
    public ResponseEntity<GetWebhookResponse> webhookInfo() {
        final Webhook webhook = stores.getWebhook();

        if (webhook == null) {
            return ResponseEntity.notFound().build();
        }

        final GetWebhookResponse webhookResponse = GetWebhookResponse.builder()
                .headers(webhook.getHeaders())
                .apiSecret(webhook.getApiSecret())
                .status(webhook.getStatus().toString())
                .url(webhook.getEndpoint())
                .build();

        return ResponseEntity.status(HttpStatus.OK).body(webhookResponse);
    }
}

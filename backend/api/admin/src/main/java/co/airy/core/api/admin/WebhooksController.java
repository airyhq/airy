package co.airy.core.api.admin;

import co.airy.avro.communication.Status;
import co.airy.avro.communication.Webhook;
import co.airy.core.api.admin.payload.*;
import co.airy.core.api.config.ServiceDiscovery;
import co.airy.core.api.config.dto.ComponentInfo;
import co.airy.model.event.payload.EventType;
import co.airy.spring.web.payload.RequestErrorResponsePayload;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import javax.validation.Valid;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;

@RestController
public class WebhooksController {
    private final Stores stores;
    private final ServiceDiscovery serviceDiscovery;

    public WebhooksController(Stores stores, ServiceDiscovery serviceDiscovery) {
        this.stores = stores;
        this.serviceDiscovery = serviceDiscovery;
    }

    @PostMapping("/webhooks.subscribe")
    public ResponseEntity<?> subscribe(@RequestBody @Valid WebhookSubscribePayload payload) {
        final ComponentInfo component = serviceDiscovery.getComponent("integration-webhook");
        if (component == null || !component.isEnabled()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(new RequestErrorResponsePayload("The webhook component needs to be enabled. Learn more: https://airy.co/docs/core/api/webhook"));
        }
        if (!component.isHealthy()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(new RequestErrorResponsePayload("The webhook component is enabled, but not healthy. Check the Kubernetes cluster state."));
        }

        final UUID id = Optional.ofNullable(payload.getId()).orElse(UUID.randomUUID());
        final Webhook webhook = Webhook.newBuilder()
                .setId(id.toString())
                .setEvents(payload.getEvents().stream().map(EventType::getEventType).collect(Collectors.toList()))
                .setEndpoint(payload.getUrl().toString())
                .setStatus(Status.Subscribed)
                .setHeaders(payload.getHeaders())
                .setSignKey(payload.getSignatureKey())
                .setSubscribedAt(Instant.now().toEpochMilli())
                .build();

        try {
            stores.storeWebhook(webhook);
        } catch (InterruptedException | ExecutionException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
        return ResponseEntity.status(HttpStatus.OK).body(fromWebhook(webhook));
    }

    @PostMapping("/webhooks.update")
    public ResponseEntity<?> update(@RequestBody @Valid WebhookUpdatePayload payload) {
        final ComponentInfo component = serviceDiscovery.getComponent("integration-webhook");
        if (component == null || !component.isEnabled()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(new RequestErrorResponsePayload("The webhook component needs to be enabled. Learn more: https://airy.co/docs/core/api/webhook"));
        }

        if (!component.isHealthy()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(new RequestErrorResponsePayload("The webhook component is enabled, but not healthy. Check the Kubernetes cluster state."));
        }

        Webhook webhook = stores.getWebhook(payload.getId().toString());
        if (webhook == null) {
            return ResponseEntity.notFound().build();
        }
        if (webhook.getStatus().equals(Status.Unsubscribed)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(fromWebhook(webhook));
        }

        webhook.setEvents(payload.getEvents().stream().map(EventType::getEventType).collect(Collectors.toList()));
        webhook.setEndpoint(payload.getUrl().toString());
        webhook.setStatus(Status.Subscribed);
        webhook.setHeaders(payload.getHeaders());
        webhook.setSignKey(payload.getSignatureKey());

        try {
            stores.storeWebhook(webhook);
        } catch (InterruptedException | ExecutionException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }

        return ResponseEntity.status(HttpStatus.OK).body(fromWebhook(webhook));
    }

    @PostMapping("/webhooks.unsubscribe")
    public ResponseEntity<?> unsubscribe(@RequestBody @Valid WebhookUnsubscribePayload payload) {
        Webhook webhook = stores.getWebhook(payload.getId().toString());
        if (webhook == null) {
            return ResponseEntity.notFound().build();
        }
        if (webhook.getStatus().equals(Status.Unsubscribed)) {
            return ResponseEntity.status(HttpStatus.OK).body(fromWebhook(webhook));
        }

        webhook.setStatus(Status.Unsubscribed);

        try {
            stores.storeWebhook(webhook);
        } catch (InterruptedException | ExecutionException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }

        return ResponseEntity.status(HttpStatus.OK).body(fromWebhook(webhook));
    }

    @PostMapping("/webhooks.info")
    public ResponseEntity<WebhookResponsePayload> webhookInfo(@RequestBody @Valid WebhookInfoRequestPayload payload) {
        final Webhook webhook = stores.getWebhook(payload.getId().toString());
        if (webhook == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.status(HttpStatus.OK).body(fromWebhook(webhook));
    }

    @PostMapping("/webhooks.list")
    public ResponseEntity<WebhookListResponsePayload> webhookList() {
        final List<WebhookListPayload> webhooks = stores.getWebhooks().stream()
                .filter(((webhook) -> webhook.getStatus().equals(Status.Subscribed)))
                .map(this::fromWebhookList).collect(Collectors.toList());
        return ResponseEntity.status(HttpStatus.OK).body(new WebhookListResponsePayload(webhooks));
    }

    private WebhookResponsePayload fromWebhook(Webhook webhook) {
        return WebhookResponsePayload.builder()
                .id(webhook.getId())
                .events(webhook.getEvents())
                .headers(webhook.getHeaders())
                .status(webhook.getStatus().toString())
                .url(webhook.getEndpoint())
                .build();
    }

    private WebhookListPayload fromWebhookList(Webhook webhook) {
        return WebhookListPayload.builder()
                .id(webhook.getId())
                .events(webhook.getEvents())
                .headers(webhook.getHeaders())
                .url(webhook.getEndpoint())
                .build();
    }
}

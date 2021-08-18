package co.airy.core.webhook;

import co.airy.avro.communication.Status;
import co.airy.avro.communication.Webhook;
import co.airy.model.event.payload.Event;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WebhookEvent {
    private String webhookId;
    private Event payload;

    public static boolean shouldSendFor(Event payload, Webhook webhook) {
        if (webhook == null || webhook.getStatus().equals(Status.Unsubscribed)) {
            return false;
        }

        final List<String> events = webhook.getEvents();
        if (events.isEmpty()) {
            return true;
        }
        final String eventType = payload.getType();
        return events.stream()
                .anyMatch((subscribedEvent) -> subscribedEvent.equals(eventType));
    }
}

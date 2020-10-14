package co.airy.core.webhook.publisher.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.Map;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class QueueMessage implements Serializable {
    private String endpoint;
    private Map<String, String> headers;
    private WebhookBody body;
}

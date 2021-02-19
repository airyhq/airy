package co.airy.core.webhook.publisher.payload;

import co.airy.model.event.payload.Event;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QueueMessage implements Serializable {
    private String endpoint;
    private Map<String, String> headers;
    private Event body;
}

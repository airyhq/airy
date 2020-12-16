package co.airy.core.sources.google;

import co.airy.avro.communication.Channel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder(toBuilder = true)
public class EventInfo implements Serializable {
    private String agentId;
    private String sourceConversationId;
    private WebhookEvent event;
    private Channel channel;
    private Long timestamp;
    private boolean isMessage;
}

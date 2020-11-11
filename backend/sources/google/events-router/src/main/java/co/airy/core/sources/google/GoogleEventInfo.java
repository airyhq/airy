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
public class GoogleEventInfo implements Serializable {
    private String agentId;
    private String conversationId;
    private String eventPayload;
    private Channel channel;
    private boolean isMessage;
}

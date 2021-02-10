package co.airy.core.api.websocket.payload;

import co.airy.model.channel.ChannelPayload;
import co.airy.model.message.dto.MessageResponsePayload;
import com.fasterxml.jackson.databind.JsonNode;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = false)
public class MetadataEvent extends Event implements Serializable {
    private MetadataEventPayload payload;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MetadataEventPayload {
        private String conversationId;
        private String channelId;
        private MessageResponsePayload message;
    }
}

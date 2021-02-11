package co.airy.core.api.websocket.payload;

import co.airy.avro.communication.Message;
import co.airy.model.message.dto.MessageResponsePayload;
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
public class MessageEvent extends Event implements Serializable {
    private MessageEventPayload payload;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MessageEventPayload {
        private String conversationId;
        private String channelId;
        private MessageResponsePayload message;
    }

    public static MessageEvent fromMessage(Message message) {
        return MessageEvent.builder()
                .payload(
                        MessageEventPayload.builder()
                                .channelId(message.getChannelId())
                                .conversationId(message.getConversationId())
                                .message(MessageResponsePayload.fromMessage(message))
                                .build()
                )
                .build();
    }
}



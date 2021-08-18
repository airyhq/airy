package co.airy.model.event.payload;

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
public class MessageCreated extends Event implements Serializable {
    private Payload payload;

    @Override
    public EventType getTypeId() {
        return EventType.MESSAGE_CREATED;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Payload {
        private String conversationId;
        private String channelId;
        private MessageResponsePayload message;
    }

    public static MessageCreated fromMessage(Message message) {
        return MessageCreated.builder()
                .payload(
                        Payload.builder()
                                .channelId(message.getChannelId())
                                .conversationId(message.getConversationId())
                                .message(MessageResponsePayload.fromMessage(message))
                                .build()
                )
                .build();
    }
}



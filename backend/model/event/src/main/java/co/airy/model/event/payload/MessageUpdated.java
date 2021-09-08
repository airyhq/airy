package co.airy.model.event.payload;

import co.airy.model.message.dto.MessageContainer;
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
public class MessageUpdated extends Event implements Serializable {
    private Payload payload;
    private Long timestamp;

    @Override
    public EventType getTypeId() {
        return EventType.MESSAGE_UPDATED;
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

    public static MessageUpdated fromMessageContainer(MessageContainer container) {
        return MessageUpdated.builder()
                .timestamp(container.getUpdatedAt())
                .payload(
                        Payload.builder()
                                .channelId(container.getMessage().getChannelId())
                                .conversationId(container.getMessage().getConversationId())
                                .message(MessageResponsePayload.fromMessageContainer(container))
                                .build()
                )
                .build();
    }
}



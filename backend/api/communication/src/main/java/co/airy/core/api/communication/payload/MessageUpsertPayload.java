package co.airy.core.api.communication.payload;

import co.airy.avro.communication.Message;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MessageUpsertPayload {
    private String conversationId;
    private String channelId;
    private MessageResponsePayload message;

    public static MessageUpsertPayload fromMessage(Message message) {
        return MessageUpsertPayload.builder()
                .channelId(message.getChannelId())
                .conversationId(message.getConversationId())
                .message(MessageResponsePayload.fromMessage(message))
                .build();
    }
}

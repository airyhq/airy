package co.airy.core.api.conversations.dto;

import co.airy.avro.communication.Message;
import co.airy.payload.response.ChannelPayload;
import co.airy.payload.response.MessageResponsePayload;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class MessageUpsertPayload implements Serializable {
    private String conversationId;
    private ChannelPayload source;
    private MessageResponsePayload message;

    public static MessageUpsertPayload fromMessage(Message message) {
        return MessageUpsertPayload.builder()
                .conversationId(message.getConversationId())
                .message(buildMessagePayload(message))
                .build();
    }

    private static MessageResponsePayload buildMessagePayload(Message message) {
        return MessageResponsePayload.builder()
                .alignment(message.getConversationId().equals(message.getSenderId()) ? "LEFT" : "RIGHT")
                .content(message.getContent())
                .id(message.getId())
                .sentAt(String.valueOf(message.getSentAt()))
                .deliveryState(message.getDeliveryState().toString())
                .build();
    }
}

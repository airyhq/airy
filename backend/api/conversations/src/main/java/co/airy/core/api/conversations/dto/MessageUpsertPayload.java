package co.airy.core.api.conversations.dto;

import co.airy.avro.communication.Channel;
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

    public static MessageUpsertPayload fromMessageAndChannel(Message message, Channel channel) {
        return MessageUpsertPayload.builder()
                .conversationId(message.getConversationId())
                .source(buildChannelPayload(channel))
                .message(buildMessagePayload(message))
                .build();
    }

    private static ChannelPayload buildChannelPayload(Channel channel) {
        return ChannelPayload.builder()
                .id(channel.getId())
                .imageUrl("")
                .name("channel name")
                .source("source")
                .sourceChannelId("source channel id")
                .build();
    }

    private static MessageResponsePayload buildMessagePayload(Message message) {
        return MessageResponsePayload.builder()
                .alignment("LEFT")
                .content(message.getContent())
                .id(message.getId())
                .offset(message.getOffset())
                .sentAt(String.valueOf(message.getSentAt()))
                .build();
    }
}

package co.airy.core.api.send_message;

import co.airy.avro.communication.Channel;
import co.airy.avro.communication.Message;
import co.airy.avro.communication.SenderType;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;

@Component
public class MessageMapper {

    @Autowired
    private ObjectMapper objectMapper;

    Message fromPayload(final String conversationId, final String rawMessage, final Channel channel) {
        SenderType senderType;
        if ("SELF".equalsIgnoreCase(channel.getSource())) {
            senderType = SenderType.APP_USER;
        } else {
            senderType = SenderType.SOURCE_USER; // never know which one is right
        }

        return Message.newBuilder()
                .setId(UUID.randomUUID().toString()) //should be v5 right?
                .setChannelId(channel.getId())
                .setContent(rawMessage)
                .setConversationId(conversationId)
                .setHeaders(Map.of()) //what goes in the headers map now?
                .setOffset(0) //hm
                .setSenderId(channel.getId())
                .setSenderType(senderType)
                .setSentAt(Instant.now().toEpochMilli())
                .build();
    }
}

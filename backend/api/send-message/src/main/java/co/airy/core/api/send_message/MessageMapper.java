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

    public Message fromPayload(final String conversationId, final String rawMessage, final Channel channel) {
        return Message.newBuilder()
                .setId(UUID.randomUUID().toString())
                .setChannelId(channel.getId())
                .setContent(rawMessage)
                .setConversationId(conversationId)
                .setHeaders(Map.of("SOURCE", channel.getSource()))
                .setOffset(0) //hm
                .setSenderId(channel.getId())
                .setSenderType(SenderType.APP_USER)
                .setSentAt(Instant.now().toEpochMilli())
                .build();
    }
}

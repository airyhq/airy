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
        final String messageId = UUID.randomUUID().toString();

        final Long sendDate = Instant.now().toEpochMilli();

        return Message.newBuilder()
                .setId(messageId)
                .setChannelId(channel.getId())
                .setContent(rawMessage)
                .setConversationId(conversationId)
                .setHeaders(Map.of()) //need to check if source is self?
                .setOffset(0) //hm
                .setSenderId(channel.getId())
                .setSenderType(SenderType.APP_USER) //need to check if self
                .setSentAt(sendDate)
                .build();
    }
}

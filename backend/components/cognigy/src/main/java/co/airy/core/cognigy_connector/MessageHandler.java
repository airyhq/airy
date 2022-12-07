package co.airy.core.cognigy_connector;

import co.airy.avro.communication.DeliveryState;
import co.airy.avro.communication.Message;
import co.airy.core.cognigy.models.MessageSendResponse;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.stereotype.Service;
import co.airy.sources_parser.SourcesParser;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;

@Service
public class MessageHandler {
    private final ObjectMapper mapper = new ObjectMapper();

    MessageHandler() {
    }

    public Message getMessage(Message contactMessage, MessageSendResponse response) throws Exception {
        String content = getContent(contactMessage.getSource(), response);
        if (content == null) {
            throw new Exception("Unable to map cognigy reply to source response.");
        }

        return Message.newBuilder()
                .setId(UUID.randomUUID().toString())
                .setChannelId(contactMessage.getChannelId())
                .setContent(content)
                .setConversationId(contactMessage.getConversationId())
                .setHeaders(Map.of())
                .setDeliveryState(DeliveryState.PENDING)
                .setSource(contactMessage.getSource())
                .setSenderId("cognigy-bot")
                .setSentAt(Instant.now().toEpochMilli())
                .setIsFromContact(false)
                .build();
    }

    public String getContent(String source, MessageSendResponse response) throws JsonProcessingException {

        final JsonNode messageNode = mapper.valueToTree(response);
        final String text = messageNode.get("text").textValue();
        final JsonNode data = messageNode.findValue("data");

        if(text == null && data == null){
            return null;
        }

        return SourcesParser.mapContent(source, text, data);
    }
}

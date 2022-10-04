package co.airy.core.cognigy_connector;

import co.airy.avro.communication.DeliveryState;
import co.airy.avro.communication.Message;
import co.airy.core. cognigy.models.MessageSendResponse;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.stereotype.Service;

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
        final String text = response.getText();
        if (text == null) {
            return null;
        }

        final ObjectNode node = getNode();
        switch (source) {
            case "google": {
                final ObjectNode representative = getNode();
                representative.put("representativeType", "BOT");
                node.set("representative", representative);
                node.put("text", text);
                return mapper.writeValueAsString(node);
            }
            case "viber": {
                node.put("text", text);
                node.put("type", text);
                return mapper.writeValueAsString(node);
            }
            case "chatplugin":
            case "instagram":
            case "facebook": {
                node.put("text", text);
                return mapper.writeValueAsString(node);
            }
            case "twilio.sms":
            case "twilio.whatsapp": {
                node.put("Body", text);
                return mapper.writeValueAsString(node);
            }
            case "whatsapp": {
                node.put("Body", text);
                return mapper.writeValueAsString(node);
            }

            default: {
                return null;
            }
        }
    }

    private ObjectNode getNode() {
        final JsonNodeFactory jsonNodeFactory = JsonNodeFactory.instance;
        return jsonNodeFactory.objectNode();
    }
}

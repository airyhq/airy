package co.airy.core.sources.whatsapp.api;

import co.airy.avro.communication.Message;
import co.airy.core.sources.whatsapp.dto.Conversation;
import co.airy.core.sources.whatsapp.dto.SendMessageRequest;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;


@Service
public class Mapper {
    private final ObjectMapper objectMapper;

    public Mapper(@Qualifier("metaObjectMapper") ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    public JsonNode getSendMessageRequest(SendMessageRequest sendMessageRequest) throws JsonProcessingException {
        final Message message = sendMessageRequest.getMessage();
        final Conversation conversation = sendMessageRequest.getConversation();
        final ObjectNode payload = ((ObjectNode) objectMapper.readTree(message.getContent()));
        payload.put("messaging_product", "whatsapp");
        payload.put("recipient_type", "individual");
        payload.put("to", conversation.getSourceConversationId());
        return payload;
    }

    public JsonNode getMarkMessageReadRequest(String whatsappMessageId) {
        final JsonNodeFactory jsonNodeFactory = JsonNodeFactory.instance;
        final ObjectNode payload = jsonNodeFactory.objectNode();

        payload.put("messaging_product", "whatsapp");
        payload.put("status", "read");
        payload.put("message_id", whatsappMessageId);
        return payload;
    }
}

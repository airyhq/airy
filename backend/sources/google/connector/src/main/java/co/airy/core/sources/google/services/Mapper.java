package co.airy.core.sources.google.services;

import co.airy.avro.communication.Message;
import co.airy.core.sources.google.model.SendMessageRequest;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.stereotype.Service;

@Service
public class Mapper {
    private final ObjectMapper mapper = new ObjectMapper();

    public JsonNode fromSendMessageRequest(SendMessageRequest sendMessageRequest) throws Exception {
        final Message message = sendMessageRequest.getMessage();
        final JsonNode messageNode = mapper.readTree(message.getContent());
        ((ObjectNode) messageNode).put("messageId", message.getId());
        return messageNode;
    }
}

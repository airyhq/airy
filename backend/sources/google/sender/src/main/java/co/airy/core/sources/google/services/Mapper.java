package co.airy.core.sources.google.services;

import co.airy.avro.communication.Message;
import co.airy.core.sources.google.model.SendMessagePayload;
import co.airy.core.sources.google.model.SendMessageRequest;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

@Service
public class Mapper {
    private final ObjectMapper objectMapper;
    Mapper(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    public SendMessagePayload fromSendMessageRequest(SendMessageRequest sendMessageRequest) throws Exception {
        final Message message = sendMessageRequest.getMessage();
        final JsonNode messageRequest = objectMapper.readTree(message.getContent());

        return SendMessagePayload.builder()
                .messageId(message.getId())
                .representative(new SendMessagePayload.Representative("HUMAN"))
                .text(messageRequest.get("text").textValue())
                .build();
    }
}

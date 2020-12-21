package co.airy.core.sources.facebook.services;

import co.airy.avro.communication.Message;
import co.airy.core.sources.facebook.dto.SendMessageRequest;
import co.airy.core.sources.facebook.model.SendMessagePayload;
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

        final SendMessagePayload.MessagePayload messagePayload = new SendMessagePayload.MessagePayload();

        final JsonNode messageRequest = objectMapper.readTree(message.getContent());

        messagePayload.setText(messageRequest.get("text").textValue());

        SendMessagePayload.SendMessagePayloadBuilder builder = SendMessagePayload.builder()
                .recipient(SendMessagePayload.MessageRecipient.builder()
                        .id(sendMessageRequest.getConversation().getSourceConversationId())
                        .build())
                .message(messagePayload);

        return builder.build();
    }
}

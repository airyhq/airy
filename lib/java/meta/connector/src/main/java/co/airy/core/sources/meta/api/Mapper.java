package co.airy.core.sources.meta.api;

import co.airy.avro.communication.Message;
import co.airy.core.sources.meta.api.model.SendMessagePayload;
import co.airy.core.sources.meta.dto.SendMessageRequest;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;


@Service
public class Mapper {
    private final ObjectMapper objectMapper = new ObjectMapper();

    public SendMessagePayload fromSendMessageRequest(SendMessageRequest sendMessageRequest) throws Exception {
        final Message message = sendMessageRequest.getMessage();
        final JsonNode messagePayload = objectMapper.readTree(message.getContent());
        SendMessagePayload.SendMessagePayloadBuilder builder = SendMessagePayload.builder()
                .recipient(SendMessagePayload.MessageRecipient.builder()
                        .id(sendMessageRequest.getConversation().getSourceConversationId())
                        .build())
                .message(messagePayload);
        return builder.build();
    }
}

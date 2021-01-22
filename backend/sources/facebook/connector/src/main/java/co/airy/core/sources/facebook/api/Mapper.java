package co.airy.core.sources.facebook.api;

import co.airy.avro.communication.Message;
import co.airy.core.sources.facebook.api.model.SendMessagePayload;
import co.airy.core.sources.facebook.dto.SendMessageRequest;
import co.airy.mapping.ContentMapper;
import co.airy.mapping.model.Content;
import co.airy.mapping.model.SourceTemplate;
import co.airy.mapping.model.Text;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class Mapper {
    private final ContentMapper mapper;

    Mapper(ContentMapper mapper) {
        this.mapper = mapper;
    }

    public SendMessagePayload fromSendMessageRequest(SendMessageRequest sendMessageRequest) throws Exception {
        final Message message = sendMessageRequest.getMessage();

        final SendMessagePayload.MessagePayload messagePayload = new SendMessagePayload.MessagePayload();

        final Content content = mapper.render(message)
                .stream()
                .findFirst()
                .orElseThrow(() -> new Exception("Message is empty"));

        if (content instanceof Text) {
            messagePayload.setText(((Text) content).getText());
        } else if (content instanceof SourceTemplate) {
            messagePayload.setAttachment(SendMessagePayload.AttachmentPayload.builder()
                    .type("template")
                    .payload(((SourceTemplate) content).getPayload())
                    .build());
        }

        SendMessagePayload.SendMessagePayloadBuilder builder = SendMessagePayload.builder()
                .recipient(SendMessagePayload.MessageRecipient.builder()
                        .id(sendMessageRequest.getConversation().getSourceConversationId())
                        .build())
                .message(messagePayload);

        return builder.build();
    }
}

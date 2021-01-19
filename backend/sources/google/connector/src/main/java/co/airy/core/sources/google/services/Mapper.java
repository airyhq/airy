package co.airy.core.sources.google.services;

import co.airy.avro.communication.Message;
import co.airy.core.sources.google.model.SendMessagePayload;
import co.airy.core.sources.google.model.SendMessageRequest;
import co.airy.mapping.ContentMapper;
import co.airy.mapping.model.Text;
import org.springframework.stereotype.Service;

@Service
public class Mapper {
    private final ContentMapper mapper;
    Mapper(ContentMapper mapper) {
        this.mapper = mapper;
    }

    public SendMessagePayload fromSendMessageRequest(SendMessageRequest sendMessageRequest) throws Exception {
        final Message message = sendMessageRequest.getMessage();
        final Text text = (Text) mapper.render(message)
                .stream()
                .filter(c -> c instanceof Text)
                .findFirst()
                .orElseThrow(() -> new Exception("google only supports text messages"));

        return SendMessagePayload.builder()
                .messageId(message.getId())
                .representative(new SendMessagePayload.Representative("HUMAN"))
                .text(text.getText())
                .build();
    }
}

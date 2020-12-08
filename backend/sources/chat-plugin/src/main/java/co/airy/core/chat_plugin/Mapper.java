package co.airy.core.chat_plugin;

import co.airy.avro.communication.Message;
import co.airy.avro.communication.SenderType;
import co.airy.core.chat_plugin.payload.MessageResponsePayload;
import co.airy.mapping.ContentMapper;
import org.springframework.stereotype.Component;

import static co.airy.payload.format.DateFormat.isoFromMillis;

@Component
public class Mapper {
    private final ContentMapper contentMapper;

    Mapper(ContentMapper contentMapper) {
        this.contentMapper = contentMapper;
    }

    public MessageResponsePayload fromMessage(Message message) {
        return MessageResponsePayload.builder()
                .content(contentMapper.renderWithDefaultAndLog(message))
                .senderType(message.getSenderType().toString().toLowerCase())
                .state(message.getDeliveryState().toString().toLowerCase())
                .id(message.getId())
                .sentAt(isoFromMillis(message.getSentAt()))
                .build();
    }
}

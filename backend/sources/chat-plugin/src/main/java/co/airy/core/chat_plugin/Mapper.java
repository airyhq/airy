package co.airy.core.chat_plugin;

import co.airy.avro.communication.Message;
import co.airy.core.chat_plugin.payload.MessageResponsePayload;
import org.springframework.stereotype.Component;

import static co.airy.date.format.DateFormat.isoFromMillis;

@Component
public class Mapper {
    public MessageResponsePayload fromMessage(Message message) {
        return MessageResponsePayload.builder()
                .content(message.getContent())
                .senderType(message.getSenderType().toString().toLowerCase())
                .state(message.getDeliveryState().toString().toLowerCase())
                .id(message.getId())
                .sentAt(isoFromMillis(message.getSentAt()))
                .build();
    }
}

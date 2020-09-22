package co.airy.core.api.conversations;

import co.airy.avro.communication.Message;
import co.airy.avro.communication.SenderType;
import co.airy.payload.response.MessageResponsePayload;

import static co.airy.payload.format.DateFormat.ISO_FROM_MILLIS;

public class MessageMapper {
    public static MessageResponsePayload fromMessage(Message message) {
        return MessageResponsePayload.builder()
                .content(message.getContent())
                .alignment(getAlignment(message.getSenderType()))
                .id(message.getId())
                .offset(message.getOffset())
                .sentAt(ISO_FROM_MILLIS(message.getSentAt()))
                .build();
    }

    static String getAlignment(SenderType senderType) {
        switch (senderType) {
            case APP_USER:
            case SOURCE_USER: return "LEFT";
            case SOURCE_CONTACT: return "RIGHT";
            default: throw new RuntimeException("Unknown sender type " + senderType);
        }
    }
}

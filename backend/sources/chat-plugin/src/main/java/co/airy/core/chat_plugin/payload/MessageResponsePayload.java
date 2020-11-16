package co.airy.core.chat_plugin.payload;

import co.airy.avro.communication.Message;
import co.airy.avro.communication.SenderType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

import static co.airy.payload.format.DateFormat.isoFromMillis;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MessageResponsePayload implements Serializable {
    private String id;
    private String content;
    private String state;
    private String alignment;
    private String sentAt;
    private String deliveryState;

    public static MessageResponsePayload fromMessage(Message message) {
        return MessageResponsePayload.builder()
                .content(message.getContent())
                .alignment(getAlignment(message.getSenderType()))
                .state(message.getDeliveryState().toString().toLowerCase())
                .id(message.getId())
                .sentAt(isoFromMillis(message.getSentAt()))
                .build();
    }

    public static String getAlignment(SenderType senderType) {
        switch (senderType) {
            case APP_USER:
            case SOURCE_USER: return "LEFT";
            case SOURCE_CONTACT: return "RIGHT";
            default: throw new RuntimeException("Unknown sender type " + senderType);
        }
    }
}

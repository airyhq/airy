package co.airy.model.message;

import co.airy.avro.communication.DeliveryState;
import co.airy.avro.communication.Message;

import java.time.Instant;

public class MessageRepository {
    public static Message updateDeliveryState(Message message, DeliveryState state) {
        message.setDeliveryState(state);
        message.setUpdatedAt(Instant.now().toEpochMilli());
        return message;
    }

    public static boolean isNewMessage(Message message) {
        return message.getUpdatedAt() == null;
    }
}

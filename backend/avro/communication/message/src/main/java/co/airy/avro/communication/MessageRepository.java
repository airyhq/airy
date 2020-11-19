package co.airy.avro.communication;

import java.time.Instant;

public class MessageRepository {
    public static Message updateDeliveryState(Message message, DeliveryState state) {
        message.setDeliveryState(state);
        message.setUpdatedAt(Instant.now().toEpochMilli());
        return message;
    }
}

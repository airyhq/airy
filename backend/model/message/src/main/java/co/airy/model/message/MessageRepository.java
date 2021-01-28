package co.airy.model.message;

import co.airy.avro.communication.DeliveryState;
import co.airy.avro.communication.Message;

import java.util.Map;
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

    public static String resolveContent(Message message, Map<String, String> metadata) {
        final String content = message.getContent();

        return metadata.entrySet()
                .stream()
                .filter((entry) -> entry.getKey().startsWith("data_"))
                .reduce(content, (updatedContent, entry) -> {
                    final String key = entry.getKey();
                    final String urlToReplace = key.replace("data_", "");

                    return updatedContent.replace(urlToReplace, entry.getValue());
                }, (oldValue, newValue) -> newValue);
    }
}

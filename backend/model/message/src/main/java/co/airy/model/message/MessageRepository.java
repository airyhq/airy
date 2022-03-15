package co.airy.model.message;

import co.airy.avro.communication.DeliveryState;
import co.airy.avro.communication.Message;
import co.airy.model.metadata.dto.MetadataMap;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.time.Instant;

public class MessageRepository {
    public static Message updateDeliveryState(Message message, DeliveryState state) {
        message.setDeliveryState(state);
        message.setUpdatedAt(Instant.now().toEpochMilli());
        return message;
    }

    public static Message markMessageForResend(Message message) {
        message.setUpdatedAt(null);
        message.setDeliveryState(DeliveryState.PENDING);
        return message;
    }

    public static boolean isNewMessage(Message message) {
        return message.getUpdatedAt() == null;
    }

    public static Object resolveContent(Message message) {
        return resolveContent(message, new MetadataMap());
    }

    public static Object resolveContent(Message message, MetadataMap metadata) {
        final String content = message.getContent();
        JsonNode jsonNode;

        final String resolvedContent =  metadata.entrySet()
                .stream()
                .filter((entry) -> entry.getKey().startsWith("data_"))
                .reduce(content, (updatedContent, entry) -> {
                    final String key = entry.getKey();
                    final String urlToReplace = key.replace("data_", "");

                    return updatedContent.replace(urlToReplace, entry.getValue().getValue());
                }, (oldValue, newValue) -> newValue);

        try {
            jsonNode = new ObjectMapper().readTree(resolvedContent);
        } catch (JsonProcessingException e) {
            return resolvedContent;
        }

        return jsonNode;
    }
}

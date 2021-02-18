package co.airy.model.message;

import co.airy.avro.communication.DeliveryState;
import co.airy.avro.communication.Message;
import co.airy.avro.communication.SenderType;
import co.airy.model.metadata.dto.MetadataMap;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.time.Instant;
import java.util.List;

public class MessageRepository {
    public static Message updateDeliveryState(Message message, DeliveryState state) {
        message.setDeliveryState(state);
        message.setUpdatedAt(Instant.now().toEpochMilli());
        return message;
    }

    public static boolean isNewMessage(Message message) {
        return message.getUpdatedAt() == null;
    }

    // In preparation for https://github.com/airyhq/airy/issues/572
    public static boolean isFromContact(Message message) {
        return message.getSenderType().equals(SenderType.SOURCE_CONTACT);
    }

    public static boolean isFromAiry(Message message) {
        return message.getSenderType().equals(SenderType.APP_USER);
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

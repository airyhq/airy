package co.airy.core.api.communication.payload;

import co.airy.core.api.communication.dto.Conversation;
import co.airy.model.channel.ChannelPayload;
import co.airy.model.message.dto.MessageResponsePayload;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import static co.airy.date.format.DateFormat.isoFromMillis;
import static co.airy.model.metadata.MetadataKeys.*;
import static co.airy.model.metadata.MetadataObjectMapper.getMetadataPayload;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ConversationResponsePayload {
    private String id;
    private String createdAt;
    private ChannelPayload channel;
    private JsonNode metadata;
    private MessageResponsePayload lastMessage;

    public static ConversationResponsePayload fromConversation(Conversation conversation) {
        JsonNode metadata = getMetadataPayload(conversation.getMetadataMap());

        return ConversationResponsePayload.builder()
                .channel(ChannelPayload.fromChannelContainer(conversation.getChannelContainer()))
                .id(conversation.getId())
                .metadata(defaultMetadata(metadata, conversation))
                .createdAt(isoFromMillis(conversation.getCreatedAt()))
                .lastMessage(MessageResponsePayload.fromMessageContainer(conversation.getLastMessageContainer()))
                .build();
    }

    private static JsonNode defaultMetadata(JsonNode metadata, Conversation conversation) {
        JsonNode contactNode = metadata.get(ConversationKeys.CONTACT) == null ?
                JsonNodeFactory.instance.objectNode() : metadata.get("contact");
        if (contactNode.get(ConversationKeys.Contact.DISPLAY_NAME) == null) {
            ((ObjectNode) contactNode).put("display_name", conversation.getDisplayNameOrDefault());
            ((ObjectNode) metadata).set("contact", contactNode);
        }

        final JsonNode unreadCount = metadata.get(ConversationKeys.UNREAD_COUNT);
        if (unreadCount == null) {
            ((ObjectNode) metadata).put(ConversationKeys.UNREAD_COUNT, 0);
        }

        return metadata;
    }
}

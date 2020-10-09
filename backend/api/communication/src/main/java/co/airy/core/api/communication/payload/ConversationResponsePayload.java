package co.airy.core.api.communication.payload;

import co.airy.avro.communication.MetadataKeys;
import co.airy.core.api.communication.dto.Conversation;
import co.airy.payload.response.ChannelPayload;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.Map;

import static co.airy.avro.communication.MetadataMapper.filterPrefix;
import static co.airy.core.api.communication.payload.MessageResponsePayload.fromMessage;
import static co.airy.payload.format.DateFormat.ISO_FROM_MILLIS;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class ConversationResponsePayload implements Serializable {
    private String id;
    private String createdAt;
    private ChannelPayload channel;
    private ContactResponsePayload contact;
    private MessageResponsePayload message;
    private Integer unreadMessageCount;

    public static ConversationResponsePayload fromConversation(Conversation conversation) {
        final Map<String, String> metadata = conversation.getMetadata();

        return ConversationResponsePayload.builder()
                .channel(ChannelPayload.builder()
                        .id(conversation.getChannelId())
                        .name(conversation.getChannel().getName())
                        .build())
                .id(conversation.getId())
                .unreadMessageCount(conversation.getUnreadCount())
                .createdAt(ISO_FROM_MILLIS(conversation.getCreatedAt()))
                .contact(ContactResponsePayload.builder()
                        .avatarUrl(metadata.get(MetadataKeys.SOURCE.CONTACT.AVATAR_URL))
                        .firstName(metadata.get(MetadataKeys.SOURCE.CONTACT.FIRST_NAME))
                        .lastName(metadata.get(MetadataKeys.SOURCE.CONTACT.LAST_NAME))
                        .info(filterPrefix(metadata, "user.contact-info"))
                        .build())
                .message(fromMessage(conversation.getLastMessage()))
                .build();
    }
}

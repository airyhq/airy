package co.airy.core.api.communication;

import co.airy.avro.communication.Message;
import co.airy.avro.communication.MetadataKeys;
import co.airy.avro.communication.MetadataMapper;
import co.airy.core.api.communication.dto.Conversation;
import co.airy.core.api.communication.payload.ContactResponsePayload;
import co.airy.core.api.communication.payload.ConversationResponsePayload;
import co.airy.core.api.communication.payload.MessageResponsePayload;
import co.airy.mapping.ContentMapper;
import co.airy.payload.response.ChannelPayload;
import org.springframework.stereotype.Component;

import java.util.Map;

import static co.airy.avro.communication.MetadataMapper.filterPrefix;
import static co.airy.core.api.communication.payload.MessageResponsePayload.getAlignment;
import static co.airy.payload.format.DateFormat.ISO_FROM_MILLIS;

@Component
public class Mapper {
    private final ContentMapper contentMapper;

    Mapper(ContentMapper contentMapper) {
        this.contentMapper = contentMapper;
    }

    public ConversationResponsePayload fromConversation(Conversation conversation) {
        final Map<String, String> metadata = conversation.getMetadata();

        return ConversationResponsePayload.builder()
                .channel(ChannelPayload.builder()
                        .id(conversation.getChannelId())
                        .name(conversation.getChannel().getName())
                        .build())
                .id(conversation.getId())
                .unreadMessageCount(conversation.getUnreadCount())
                .tags(MetadataMapper.getTags(metadata))
                .createdAt(ISO_FROM_MILLIS(conversation.getCreatedAt()))
                .contact(ContactResponsePayload.builder()
                        .avatarUrl(metadata.get(MetadataKeys.source.contact.AVATAR_URL))
                        .firstName(metadata.get(MetadataKeys.source.contact.FIRST_NAME))
                        .lastName(metadata.get(MetadataKeys.source.contact.LAST_NAME))
                        .info(filterPrefix(metadata, "user.contact-info"))
                        .build())
                .message(fromMessage(conversation.getLastMessage()))
                .build();
    }

    public MessageResponsePayload fromMessage(Message message) {
        return MessageResponsePayload.builder()
                .content(contentMapper.renderWithDefaultAndLog(message))
                .alignment(getAlignment(message.getSenderType()))
                .state(message.getDeliveryState().toString().toLowerCase())
                .id(message.getId())
                .sentAt(ISO_FROM_MILLIS(message.getSentAt()))
                .build();
    }
}

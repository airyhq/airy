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
import static co.airy.payload.format.DateFormat.isoFromMillis;

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
                .createdAt(isoFromMillis(conversation.getCreatedAt()))
                .contact(ContactResponsePayload.builder()
                        .avatarUrl(metadata.get(MetadataKeys.Source.Contact.AVATAR_URL))
                        .firstName(metadata.get(MetadataKeys.Source.Contact.FIRST_NAME))
                        .lastName(metadata.get(MetadataKeys.Source.Contact.LAST_NAME))
                        .info(filterPrefix(metadata, "user.contact-info"))
                        .build())
                .lastMessage(fromMessage(conversation.getLastMessage()))
                .build();
    }

    public MessageResponsePayload fromMessage(Message message) {
        return MessageResponsePayload.builder()
                .content(contentMapper.renderWithDefaultAndLog(message))
                .alignment(getAlignment(message.getSenderType()))
                .deliveryState(message.getDeliveryState().toString().toLowerCase())
                .id(message.getId())
                .sentAt(isoFromMillis(message.getSentAt()))
                .build();
    }
}

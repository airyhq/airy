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

import static co.airy.avro.communication.MetadataKeys.PUBLIC;
import static co.airy.avro.communication.MetadataMapper.filterPrefix;
import static co.airy.payload.format.DateFormat.isoFromMillis;
import static org.springframework.util.StringUtils.capitalize;

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
                .contact(getContact(conversation))
                .lastMessage(fromMessage(conversation.getLastMessage()))
                .build();
    }

    private ContactResponsePayload getContact(Conversation conversation) {
        final Map<String, String> metadata = conversation.getMetadata();

        String firstName = metadata.get(MetadataKeys.Source.Contact.FIRST_NAME);
        String lastName = metadata.get(MetadataKeys.Source.Contact.LAST_NAME);

        // Default to a display name that looks like: "Facebook 4ecb3"
        if (firstName == null && lastName == null) {
            firstName = prettifySource(conversation.getChannel().getSource());
            lastName = conversation.getId().substring(31); // UUIDs have a fixed length of 36
        }

        return ContactResponsePayload.builder()
                .avatarUrl(metadata.get(MetadataKeys.Source.Contact.AVATAR_URL))
                .firstName(firstName)
                .lastName(lastName)
                .info(filterPrefix(metadata, PUBLIC))
                .build();
    }

    /**
     * - Remove the source provider (see docs/docs/glossary.md#source-provider)
     * - Capitalize first letter
     * E.g. twilio.sms -> Sms, facebook -> Facebook
     */
    private String prettifySource(String source) {
        final String[] splits = source.split("\\.");
        source = splits[splits.length - 1];
        return capitalize(source);
    }

    public MessageResponsePayload fromMessage(Message message) {
        return MessageResponsePayload.builder()
                .content(contentMapper.renderWithDefaultAndLog(message))
                .senderType(message.getSenderType().toString().toLowerCase())
                .deliveryState(message.getDeliveryState().toString().toLowerCase())
                .id(message.getId())
                .sentAt(isoFromMillis(message.getSentAt()))
                .build();
    }
}

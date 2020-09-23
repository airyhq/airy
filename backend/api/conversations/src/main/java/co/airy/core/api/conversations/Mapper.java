package co.airy.core.api.conversations;

import co.airy.avro.communication.Message;
import co.airy.avro.communication.MetadataKeys;
import co.airy.avro.communication.SenderType;
import co.airy.core.api.conversations.dto.Conversation;
import co.airy.payload.response.ChannelPayload;
import co.airy.payload.response.ContactResponsePayload;
import co.airy.payload.response.ConversationResponsePayload;
import co.airy.payload.response.MessageResponsePayload;

import java.util.Map;

import static co.airy.avro.communication.MetadataMapper.filterPrefix;
import static co.airy.payload.format.DateFormat.ISO_FROM_MILLIS;

public class Mapper {
    public static MessageResponsePayload fromMessage(Message message) {
        return MessageResponsePayload.builder()
                .content(message.getContent())
                .alignment(getAlignment(message.getSenderType()))
                .id(message.getId())
                .offset(message.getOffset())
                .sentAt(ISO_FROM_MILLIS(message.getSentAt()))
                .build();
    }

    static String getAlignment(SenderType senderType) {
        switch (senderType) {
            case APP_USER:
            case SOURCE_USER: return "LEFT";
            case SOURCE_CONTACT: return "RIGHT";
            default: throw new RuntimeException("Unknown sender type " + senderType);
        }
    }

    public static ConversationResponsePayload fromConversation(Conversation conversation) {
        final Map<String, String> metadata = conversation.getMetadata();

        return ConversationResponsePayload.builder()
                .channel(
                        ChannelPayload.builder()
                                .id(conversation.getChannelId())
                                .name(conversation.getChannel().getName())
                                .build()
                )
                .id(conversation.getId())
                .createdAt(ISO_FROM_MILLIS(conversation.getCreatedAt()))
                .contact(
                        ContactResponsePayload.builder()
                                .avatarUrl(metadata.get(MetadataKeys.SOURCE.CONTACT.AVATAR_URL))
                                .firstName(metadata.get(MetadataKeys.SOURCE.CONTACT.FIRST_NAME))
                                .lastName(metadata.get(MetadataKeys.SOURCE.CONTACT.LAST_NAME))
                                .info(filterPrefix(metadata, "user.contact-info"))
                                .build()
                )
                .message(fromMessage(conversation.getLastMessage()))
                .build();
    }
}

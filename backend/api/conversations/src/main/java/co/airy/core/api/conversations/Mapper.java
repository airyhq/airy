package co.airy.core.api.conversations;

import co.airy.avro.communication.DeliveryState;
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
                .state(getState(message.getDeliveryState()))
                .id(message.getId())
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

    static String getState(DeliveryState deliveryState) {
        switch (deliveryState) {
            case FAILED: return "failed";
            case PENDING: return "pending";
            case DELIVERED: return "delivered";
            default: throw new RuntimeException("Unknown delivery type " + deliveryState);
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

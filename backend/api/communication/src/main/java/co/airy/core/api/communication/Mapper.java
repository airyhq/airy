package co.airy.core.api.communication;

import co.airy.avro.communication.Message;
import co.airy.core.api.communication.dto.Conversation;
import co.airy.core.api.communication.dto.DisplayName;
import co.airy.core.api.communication.payload.ContactResponsePayload;
import co.airy.core.api.communication.payload.ConversationResponsePayload;
import co.airy.core.api.communication.payload.MessageResponsePayload;
import co.airy.model.channel.ChannelPayload;
import co.airy.model.metadata.MetadataKeys;
import co.airy.model.metadata.MetadataRepository;
import org.springframework.stereotype.Component;

import java.util.Map;

import static co.airy.date.format.DateFormat.isoFromMillis;
import static co.airy.model.metadata.MetadataRepository.getConversationInfo;
import static java.util.stream.Collectors.toList;

@Component
public class Mapper {

    public ConversationResponsePayload fromConversation(Conversation conversation) {
        final Map<String, String> metadata = conversation.getMetadata();

        return ConversationResponsePayload.builder()
                .channel(ChannelPayload.builder()
                        .id(conversation.getChannelId())
                        .name(conversation.getChannel().getName())
                        .source(conversation.getChannel().getSource())
                        .build())
                .id(conversation.getId())
                .unreadMessageCount(conversation.getUnreadMessageCount())
                .tags(
                        MetadataRepository.filterPrefix(metadata, MetadataKeys.TAGS)
                        .keySet()
                                .stream()
                                .map(s -> s.split("\\.")[1])
                                .collect(toList())
                )
                .createdAt(isoFromMillis(conversation.getCreatedAt()))
                .contact(getContact(conversation))
                .lastMessage(fromMessage(conversation.getLastMessage()))
                .build();
    }

    private ContactResponsePayload getContact(Conversation conversation) {
        final Map<String, String> metadata = conversation.getMetadata();
        final DisplayName displayName = conversation.getDisplayNameOrDefault();

        return ContactResponsePayload.builder()
                .avatarUrl(metadata.get(MetadataKeys.Source.Contact.AVATAR_URL))
                .displayName(displayName.toString())
                .info(getConversationInfo(metadata))
                .build();
    }

    public MessageResponsePayload fromMessage(Message message) {
        return MessageResponsePayload.builder()
                .content(message.getContent())
                .senderType(message.getSenderType().toString().toLowerCase())
                .deliveryState(message.getDeliveryState().toString().toLowerCase())
                .id(message.getId())
                .sentAt(isoFromMillis(message.getSentAt()))
                .build();
    }
}

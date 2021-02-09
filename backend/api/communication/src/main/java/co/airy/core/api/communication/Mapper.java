package co.airy.core.api.communication;

import co.airy.core.api.communication.dto.Conversation;
import co.airy.core.api.communication.dto.DisplayName;
import co.airy.core.api.communication.payload.ContactResponsePayload;
import co.airy.core.api.communication.payload.ConversationResponsePayload;
import co.airy.model.channel.ChannelPayload;
import co.airy.model.message.dto.MessageResponsePayload;
import co.airy.model.metadata.MetadataKeys;
import org.springframework.stereotype.Component;

import java.util.Map;

import static co.airy.date.format.DateFormat.isoFromMillis;
import static co.airy.model.metadata.MetadataRepository.getConversationInfo;

@Component
public class Mapper {

    public ConversationResponsePayload fromConversation(Conversation conversation) {
        return ConversationResponsePayload.builder()
                .channel(ChannelPayload.builder()
                        .id(conversation.getChannelId())
                        .name(conversation.getChannel().getName())
                        .source(conversation.getChannel().getSource())
                        .build())
                .id(conversation.getId())
                .unreadMessageCount(conversation.getUnreadMessageCount())
                .tags(conversation.getTagIds())
                .createdAt(isoFromMillis(conversation.getCreatedAt()))
                .contact(getContact(conversation))
                .lastMessage(MessageResponsePayload.fromMessageContainer(conversation.getLastMessageContainer()))
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
}

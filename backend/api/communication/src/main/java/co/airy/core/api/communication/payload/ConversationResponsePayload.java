package co.airy.core.api.communication.payload;

import co.airy.model.channel.ChannelPayload;
import co.airy.model.conversation.Conversation;
import co.airy.model.message.dto.MessageResponsePayload;
import com.fasterxml.jackson.databind.JsonNode;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import static co.airy.date.format.DateFormat.isoFromMillis;
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
                .metadata(conversation.defaultMetadata(metadata))
                .createdAt(isoFromMillis(conversation.getCreatedAt()))
                .lastMessage(MessageResponsePayload.fromMessageContainer(conversation.getLastMessageContainer()))
                .build();
    }
}

package co.airy.model.conversation;

import co.airy.model.channel.ChannelPayload;
import co.airy.model.message.dto.MessageResponsePayload;
import com.fasterxml.jackson.annotation.JsonInclude;
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
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ConversationPayload {
    private String id;
    private String createdAt;
    private JsonNode metadata;
    private MessageResponsePayload lastMessage;

    // Populate the channel if it's available and only channel id if not
    private ChannelPayload channel;
    private String channelId;

    public static ConversationPayload fromConversation(Conversation conversation) {
        JsonNode metadata = getMetadataPayload(conversation.getMetadataMap());

        final ConversationPayloadBuilder builder = ConversationPayload.builder()
                .id(conversation.getId())
                .metadata(conversation.defaultMetadata(metadata))
                .createdAt(isoFromMillis(conversation.getCreatedAt()))
                .lastMessage(MessageResponsePayload.fromMessageContainer(conversation.getLastMessageContainer()));

        if (conversation.getChannel() != null) {
            builder.channel(ChannelPayload.fromChannelContainer(conversation.getChannelContainer()));
        } else {
            builder.channelId(conversation.getChannelId());
        }

        return builder.build();
    }
}

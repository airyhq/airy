package co.airy.core.api.communication.dto;

import co.airy.model.conversation.Conversation;
import co.airy.model.metadata.dto.MetadataNode;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ConversationIndex implements Serializable {
    private String id;
    private String displayName;
    private String channelId;
    private String source;
    private Long createdAt;
    private Integer unreadMessageCount;
    private List<String> tagIds;
    private Long lastMessageAt;

    @Builder.Default
    private List<MetadataNode> metadata = new ArrayList<>();

    public static ConversationIndex fromConversation(Conversation conversation) {
        final List<MetadataNode> metadataNodes = conversation.getMetadataMap().values().stream()
                .map((record) -> new MetadataNode(record.getKey(), record.getValue(), record.getValueType()))
                .collect(Collectors.toList());

        return ConversationIndex.builder()
                .id(conversation.getId())
                .channelId(conversation.getChannelId())
                .source(conversation.getChannelContainer().getChannel().getSource())
                .displayName(conversation.getDisplayNameOrDefault())
                .metadata(metadataNodes)
                .createdAt(conversation.getCreatedAt())
                .tagIds(conversation.getTagIds())
                .unreadMessageCount(conversation.getUnreadMessageCount())
                .lastMessageAt(conversation.getLastMessageContainer().getMessage().getSentAt())
                .build();
    }
}

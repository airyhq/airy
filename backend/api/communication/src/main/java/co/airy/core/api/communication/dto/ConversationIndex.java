package co.airy.core.api.communication.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.List;

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

    public static ConversationIndex fromConversation(Conversation conversation) {
        return ConversationIndex.builder()
                .id(conversation.getId())
                .channelId(conversation.getChannelId())
                .source(conversation.getChannelContainer().getChannel().getSource())
                .displayName(conversation.getDisplayNameOrDefault())
                .createdAt(conversation.getCreatedAt())
                .tagIds(conversation.getTagIds())
                .unreadMessageCount(conversation.getUnreadMessageCount())
                .build();
    }
}

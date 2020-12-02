package co.airy.core.api.communication.dto;

import lombok.Builder;
import lombok.Data;

import java.util.HashMap;
import java.util.Map;

@Data
@Builder
public class ConversationIndex {
    private String id;
    private String displayName;
    private Long createdAt;
    private Integer unreadCount;

    @Builder.Default
    private Map<String, String> metadata = new HashMap<>();

    public static ConversationIndex fromConversation(Conversation conversation) {
        return ConversationIndex.builder()
                .id(conversation.getId())
                .displayName(conversation.getDisplayName())
                .metadata(new HashMap<>(conversation.getMetadata()))
                .createdAt(conversation.getCreatedAt())
                .unreadCount(conversation.getUnreadCount())
                .build();
    }
}

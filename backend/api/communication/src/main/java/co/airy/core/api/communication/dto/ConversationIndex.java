package co.airy.core.api.communication.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ConversationIndex implements Serializable {
    private String id;
    private String displayName;
    private String channelId;
    private Long createdAt;
    private Integer unreadCount;

    @Builder.Default
    private Map<String, String> metadata = new HashMap<>();

    public static ConversationIndex fromConversation(Conversation conversation) {
        return ConversationIndex.builder()
                .id(conversation.getId())
                .channelId(conversation.getChannelId())
                .displayName(conversation.getDisplayNameOrDefault().toString())
                .metadata(new HashMap<>(conversation.getMetadata()))
                .createdAt(conversation.getCreatedAt())
                .unreadCount(conversation.getUnreadCount())
                .build();
    }
}

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
    private String source;
    private Long createdAt;
    private Integer unreadMessageCount;

    @Builder.Default
    private Map<String, String> metadata = new HashMap<>();

    public static ConversationIndex fromConversation(Conversation conversation) {
        return ConversationIndex.builder()
                .id(conversation.getId())
                .channelId(conversation.getChannelId())
                .source(conversation.getChannel().getSource())
                .displayName(conversation.getDisplayNameOrDefault().toString())
                .metadata(new HashMap<>(conversation.getMetadata()))
                .createdAt(conversation.getCreatedAt())
                .unreadMessageCount(conversation.getUnreadMessageCount())
                .build();
    }
}

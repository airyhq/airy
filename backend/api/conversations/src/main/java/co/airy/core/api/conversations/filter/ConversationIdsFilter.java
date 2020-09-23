package co.airy.core.api.conversations.filter;

import co.airy.core.api.conversations.dto.Conversation;
import co.airy.core.api.conversations.payload.QueryFilterPayload;
import org.springframework.stereotype.Component;

import java.util.UUID;
import java.util.stream.Collectors;

@Component
public class ConversationIdsFilter implements Filter<Conversation> {
    @Override
    public boolean filter(Conversation conversation, QueryFilterPayload filterPayload) {
        if (filterPayload.getConversationIds() == null) {
            return true;
        }

        return filterPayload.getConversationIds().stream().map(UUID::toString).collect(Collectors.toList())
                .contains(conversation.getId());
    }
}

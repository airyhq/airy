package co.airy.core.api.conversations.filter;

import co.airy.core.api.conversations.dto.Conversation;
import co.airy.core.api.conversations.payload.QueryFilterPayload;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ConversationIdsFilter implements Filter<Conversation> {
    @Override
    public boolean filter(Conversation conversation, QueryFilterPayload filterPayload) {
        final List<String> conversationIds = filterPayload.getConversationIds();

        if (conversationIds == null) {
            return true;
        }

        return conversationIds.contains(conversation.getConversationId());
    }
}

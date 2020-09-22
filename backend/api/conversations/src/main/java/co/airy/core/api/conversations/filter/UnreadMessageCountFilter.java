package co.airy.core.api.conversations.filter;

import co.airy.core.api.conversations.dto.Conversation;
import co.airy.core.api.conversations.payload.QueryFilterPayload;
import org.springframework.stereotype.Component;

@Component
public class UnreadMessageCountFilter implements Filter<Conversation> {

    @Override
    public boolean filter(Conversation conversation, QueryFilterPayload filterPayload) {
        if (filterPayload.getMinUnreadMessageCount() == null && filterPayload.getMaxUnreadMessageCount() == null) {
            return true;
        } else if(conversation.getUnreadMessageCount() == null) {
            return false;
        }

        final int minUnreadMessageCount = filterPayload.getMinUnreadMessageCount() != null ? filterPayload.getMinUnreadMessageCount() : 0;
        final int maxUnreadMessageCount = filterPayload.getMaxUnreadMessageCount() != null ? filterPayload.getMaxUnreadMessageCount() : Integer.MAX_VALUE;

        return (conversation.getUnreadMessageCount() >= minUnreadMessageCount && conversation.getUnreadMessageCount() <= maxUnreadMessageCount);
    }

}

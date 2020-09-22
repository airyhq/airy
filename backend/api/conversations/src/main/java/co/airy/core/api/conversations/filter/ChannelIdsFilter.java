package co.airy.core.api.conversations.filter;

import co.airy.core.api.conversations.dto.Conversation;
import co.airy.core.api.conversations.payload.QueryFilterPayload;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ChannelIdsFilter implements Filter<Conversation> {
    @Override
    public boolean filter(Conversation conversation, QueryFilterPayload filterPayload) {
        final List<String> channelIds = filterPayload.getChannelIds();

        if (channelIds == null) {
            return true;
        }

        return channelIds.contains(conversation.getChannelId());
    }
}

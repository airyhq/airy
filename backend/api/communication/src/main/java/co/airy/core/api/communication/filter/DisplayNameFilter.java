package co.airy.core.api.communication.filter;

import co.airy.core.api.communication.dto.Conversation;
import co.airy.core.api.communication.payload.QueryFilterPayload;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DisplayNameFilter implements Filter<Conversation> {
    @Override
    public boolean filter(Conversation conversation, QueryFilterPayload filterPayload) {
        final List<String> displayNamesFilter = filterPayload.getDisplayNames();

        if(displayNamesFilter == null) {
            return true;
        } else if (conversation.getDisplayName() == null) {
            return false;
        }


        return displayNamesFilter
            .stream()
            .anyMatch(displayName -> conversation.getDisplayName().toLowerCase().trim().contains(displayName.toLowerCase().trim()));
    }
}

package co.airy.core.api.conversations.payload;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QueryFilterPayload {
    private List<UUID> conversationIds;

    private List<String> channelIds;

    private List<String> displayNames;
}


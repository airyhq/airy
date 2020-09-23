package co.airy.core.api.conversations.payload;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QueryFilterPayload {
    private List<String> conversationIds;

    private List<String> channelIds;

    private List<String> displayNames;
}


package co.airy.core.api.communication.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class LuceneQueryResult {
    private List<ConversationIndex> conversations;
    private int total;
}

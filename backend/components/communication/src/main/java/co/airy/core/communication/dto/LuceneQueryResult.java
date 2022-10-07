package co.airy.core.communication.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class LuceneQueryResult {
    private List<ConversationIndex> conversations;
    private long filteredTotal;
    private int total;
}

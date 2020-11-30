package co.airy.core.api.communication.dto;

import co.airy.core.api.communication.dto.Conversation;
import co.airy.core.api.communication.payload.ResponseMetadata;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class LuceneQueryResult {
    private List<Conversation> conversations;
    private ResponseMetadata responseMetadata;
}

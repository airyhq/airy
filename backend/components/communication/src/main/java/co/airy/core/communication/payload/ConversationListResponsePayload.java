package co.airy.core.communication.payload;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ConversationListResponsePayload {
    private List<ConversationResponsePayload> data;
    private PaginationData paginationData;
}

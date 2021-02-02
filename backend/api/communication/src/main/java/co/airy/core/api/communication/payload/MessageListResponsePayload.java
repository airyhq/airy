package co.airy.core.api.communication.payload;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MessageListResponsePayload {
    private List<MessageResponsePayload> data;
    private PaginationData paginationData;
}

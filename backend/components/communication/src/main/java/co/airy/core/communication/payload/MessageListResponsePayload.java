package co.airy.core.communication.payload;

import co.airy.model.message.dto.MessageResponsePayload;
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

package co.airy.core.contacts.payload;

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
public class RecentMessagesResponsePayload {
    private List<MessageResponsePayload> data;
    private PaginationData paginationData;
}

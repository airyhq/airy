package co.airy.core.api.conversations.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ConversationListRequestPayload {
    private QueryFilterPayload filter;
    private String cursor;
    private int pageSize = 10;
}

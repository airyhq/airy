package co.airy.core.communication.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ConversationListRequestPayload {
    private String filters;
    private String cursor;
    private int pageSize = 20;
}

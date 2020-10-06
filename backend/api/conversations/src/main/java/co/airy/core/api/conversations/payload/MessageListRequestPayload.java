package co.airy.core.api.conversations.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MessageListRequestPayload {
    private UUID conversationId;
    private String cursor;
    private Integer pageSize;
}

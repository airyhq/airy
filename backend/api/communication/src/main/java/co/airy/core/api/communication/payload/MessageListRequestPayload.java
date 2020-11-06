package co.airy.core.api.communication.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MessageListRequestPayload {
    @NonNull
    private UUID conversationId;
    private String cursor;
    private Integer pageSize;
}

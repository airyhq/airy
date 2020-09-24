package co.airy.core.api.conversations.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MessageListRequestPayload {
    private UUID conversationId;
    private Long cursor;
    private Long pageSize;
}

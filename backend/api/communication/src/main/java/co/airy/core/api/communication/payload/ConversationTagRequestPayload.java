package co.airy.core.api.communication.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ConversationTagRequestPayload {
    private UUID conversationId;
    private UUID tagId;
}

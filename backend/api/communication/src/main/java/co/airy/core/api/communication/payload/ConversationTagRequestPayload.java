package co.airy.core.api.communication.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ConversationTagRequestPayload {
    @NonNull
    private UUID conversationId;
    @NonNull
    private UUID tagId;
}

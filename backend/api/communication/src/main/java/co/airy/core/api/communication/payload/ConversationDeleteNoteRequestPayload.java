package co.airy.core.api.communication.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotNull;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ConversationDeleteNoteRequestPayload {
    @NotNull
    private UUID conversationId;
    @NotNull
    private UUID noteId;
}

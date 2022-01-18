package co.airy.core.api.communication.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ConversationUpdateNoteRequestPayload {
    @NotNull
    private UUID noteId;
    @NotNull
    private UUID conversationId;
    @NotNull
    @Size(min = 1, max = 50000)
    private String text;
}

package co.airy.core.api.admin.payload;

import co.airy.avro.communication.Note;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotePayload {
    private String noteId;
    private String text;
    private String conversationId;

    public static NotePayload fromNote(Note note) {
        return NotePayload.builder()
                .noteId(note.getNoteId())
                .text(note.getText())
                .conversationId(note.getConversationId())
                .build();
    }
}

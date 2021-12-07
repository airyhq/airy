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
    private String id;
    private String text;

    public static NotePayload fromNote(Note note) {
        return NotePayload.builder()
                .id(note.getId())
                .text(note.getText())
                .build();
    }
}

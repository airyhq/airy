package co.airy.model.event.payload;

import co.airy.avro.communication.Note;
import co.airy.core.api.admin.payload.NotePayload;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = false)
public class NoteEvent extends Event implements Serializable {
    private NotePayload payload;
    private Long timestamp;

    public static NoteEvent fromNote(Note note) {
        return builder()
                .timestamp(Instant.now().toEpochMilli()) // TODO record channel update date
                .payload(NotePayload.fromNote(note)).build();
    }

    @Override
    public EventType getTypeId() {
        return EventType.NOTE_UPDATED;
    }
}

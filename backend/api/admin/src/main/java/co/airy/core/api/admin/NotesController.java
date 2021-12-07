package co.airy.core.api.admin;

import co.airy.avro.communication.Note;
import co.airy.core.api.admin.payload.*;
import co.airy.spring.web.payload.RequestErrorResponsePayload;
import org.apache.kafka.streams.state.KeyValueIterator;
import org.apache.kafka.streams.state.ReadOnlyKeyValueStore;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ExecutionException;

import static java.util.stream.Collectors.toList;

@RestController
public class NotesController {
    private final Stores stores;
    private final String wrongNoteErrorMessage;

    NotesController(Stores stores) {
        this.stores = stores;
        this.wrongNoteErrorMessage = "Text length must be >0 and <50000";
    }

    @PostMapping("/notes.create")
    ResponseEntity<?> createNote(@RequestBody @Valid CreateNoteRequestPayload payload) {
        if (payload.getText().length() == 0 || payload.getText().length() >50000) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new RequestErrorResponsePayload(wrongNoteErrorMessage));
        }

        final Note note = Note.newBuilder()
                .setId(UUID.randomUUID().toString())
                .setText(payload.getText())
                .build();

        try {
            stores.storeNote(note);
        } catch (InterruptedException | ExecutionException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }

        return ResponseEntity.status(201).body(NotePayload.fromNote(note));
    }

    @PostMapping("/notes.list")
    ResponseEntity<ListNotesResponsePayload> listNotes() {
        final ReadOnlyKeyValueStore<String, Note> store = stores.getNotesStore();
        final KeyValueIterator<String, Note> iterator = store.all();

        List<Note> Notes = new ArrayList<>();
        iterator.forEachRemaining(kv -> Notes.add(kv.value));

        final List<NotePayload> data = Notes.stream().map(NotePayload::fromNote).collect(toList());

        return ResponseEntity.ok().body(ListNotesResponsePayload.builder().data(data).build());
    }

    @PostMapping("/notes.delete")
    ResponseEntity<Void> deleteNote(@RequestBody @Valid DeleteNoteRequestPayload payload) {
        final Note Note = stores.getNotesStore().get(payload.getId().toString());
        if (Note == null) {
            return ResponseEntity.notFound().build();
        }

        stores.deleteNote(Note);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/notes.update")
    ResponseEntity<?> updateNote(@RequestBody @Valid UpdateNoteRequestPayload payload) {
        final Note note = stores.getNotesStore().get(payload.getId().toString());
        if (note == null) {
            return ResponseEntity.notFound().build();
        }

        final String text = payload.getText();
        if (text != null && (text.length() == 0 || text.length() > 50000)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new RequestErrorResponsePayload(wrongNoteErrorMessage));
        }

        note.setText(Optional.ofNullable(payload.getText()).orElse(note.getText()));

        try {
            stores.storeNote(note);
        } catch (ExecutionException | InterruptedException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
        return ResponseEntity.noContent().build();
    }
}

package co.airy.core.unread_counter;

import co.airy.avro.communication.ReadReceipt;
import co.airy.core.unread_counter.payload.MarkReadRequestPayload;
import co.airy.spring.web.payload.RequestErrorResponsePayload;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.io.IOException;
import java.time.Instant;

@RestController
public class UnreadCounterController {
    private final Stores stores;

    UnreadCounterController(Stores stores) throws IOException {
        this.stores = stores;
    }

    @PostMapping("/conversations.mark-read")
    ResponseEntity<?> conversationMarkRead(@RequestBody @Valid MarkReadRequestPayload payload) {
        final String conversationId = payload.getConversationId().toString();
        final ReadReceipt readReceipt = ReadReceipt.newBuilder()
                .setConversationId(conversationId)
                .setReadDate(Instant.now().toEpochMilli())
                .build();

        try {
            stores.storeReadReceipt(readReceipt);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new RequestErrorResponsePayload(e.getMessage()));
        }

        return ResponseEntity.noContent().build();
    }
}

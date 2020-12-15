package co.airy.core.api.communication;

import co.airy.avro.communication.MetadataAction;
import co.airy.avro.communication.MetadataActionType;
import co.airy.core.api.communication.payload.RemoveMetadataRequestPayload;
import co.airy.core.api.communication.payload.SetMetadataRequestPayload;
import co.airy.payload.response.EmptyResponsePayload;
import co.airy.payload.response.RequestErrorResponsePayload;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.time.Instant;

import static co.airy.avro.communication.MetadataKeys.PUBLIC;

@RestController
public class MetadataController {
    private final Stores stores;

    public MetadataController(Stores stores) {
        this.stores = stores;
    }

    @PostMapping("/metadata.set")
    ResponseEntity<?> setMetadata(@RequestBody @Valid SetMetadataRequestPayload setMetadataRequestPayload) {
        final MetadataAction metadataAction = MetadataAction.newBuilder()
                .setActionType(MetadataActionType.SET)
                .setTimestamp(Instant.now().toEpochMilli())
                .setConversationId(setMetadataRequestPayload.getConversationId())
                .setValue(setMetadataRequestPayload.getValue())
                .setKey(PUBLIC + "." + setMetadataRequestPayload.getKey())
                .build();
        try {
            stores.storeMetadata(metadataAction);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new RequestErrorResponsePayload(e.getMessage()));
        }
        return ResponseEntity.ok(new EmptyResponsePayload());
    }

    @PostMapping("/metadata.remove")
    ResponseEntity<?> removeMetadata(@RequestBody @Valid RemoveMetadataRequestPayload removeMetadataRequestPayload) {
        final MetadataAction metadataAction = MetadataAction.newBuilder()
                .setActionType(MetadataActionType.REMOVE)
                .setTimestamp(Instant.now().toEpochMilli())
                .setConversationId(removeMetadataRequestPayload.getConversationId())
                .setKey(PUBLIC + "." + removeMetadataRequestPayload.getKey())
                .setValue("")
                .build();
        try {
            stores.storeMetadata(metadataAction);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new RequestErrorResponsePayload(e.getMessage()));
        }
        return ResponseEntity.ok(new EmptyResponsePayload());
    }
}

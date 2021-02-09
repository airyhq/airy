package co.airy.core.api.communication;

import co.airy.avro.communication.Metadata;
import co.airy.core.api.communication.payload.RemoveMetadataRequestPayload;
import co.airy.core.api.communication.payload.SetMetadataRequestPayload;
import co.airy.model.metadata.Subject;
import co.airy.spring.web.payload.EmptyResponsePayload;
import co.airy.spring.web.payload.RequestErrorResponsePayload;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;

import static co.airy.model.metadata.MetadataKeys.USER_DATA;
import static co.airy.model.metadata.MetadataRepository.newConversationMetadata;

@RestController
public class MetadataController {
    private final Stores stores;

    public MetadataController(Stores stores) {
        this.stores = stores;
    }

    @PostMapping("/metadata.set")
    ResponseEntity<?> setMetadata(@RequestBody @Valid SetMetadataRequestPayload requestPayload) {
        final Metadata metadata = newConversationMetadata(requestPayload.getConversationId(),
                USER_DATA + "." + requestPayload.getKey(),
                requestPayload.getValue());
        try {
            stores.storeMetadata(metadata);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new RequestErrorResponsePayload(e.getMessage()));
        }
        return ResponseEntity.ok(new EmptyResponsePayload());
    }

    @PostMapping("/metadata.remove")
    ResponseEntity<?> removeMetadata(@RequestBody @Valid RemoveMetadataRequestPayload requestPayload) {
        final Subject subject = new Subject("conversation", requestPayload.getConversationId());
        final String metadataKey = USER_DATA + "." + requestPayload.getKey();

        try {
            stores.deleteMetadata(subject, metadataKey);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new RequestErrorResponsePayload(e.getMessage()));
        }
        return ResponseEntity.ok(new EmptyResponsePayload());
    }
}

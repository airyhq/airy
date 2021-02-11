package co.airy.core.api.communication;

import co.airy.avro.communication.Metadata;
import co.airy.core.api.communication.payload.RemoveMetadataRequestPayload;
import co.airy.core.api.communication.payload.SetMetadataRequestPayload;
import co.airy.core.api.communication.payload.UpsertMetadataRequestPayload;
import co.airy.model.metadata.MetadataObjectMapper;
import co.airy.model.metadata.Subject;
import co.airy.spring.web.payload.EmptyResponsePayload;
import co.airy.spring.web.payload.RequestErrorResponsePayload;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.util.List;

import static co.airy.model.metadata.MetadataKeys.USER_DATA;
import static co.airy.model.metadata.MetadataRepository.newConversationMetadata;

@RestController
public class MetadataController {
    private final Stores stores;

    public MetadataController(Stores stores) {
        this.stores = stores;
    }

    @PostMapping("/metadata.upsert")
    ResponseEntity<?> upsert(@RequestBody @Valid UpsertMetadataRequestPayload upsertMetadataRequestPayload) {
        List<Metadata> metadataList;
        try {
            final Subject subject = new Subject(upsertMetadataRequestPayload.getSubject(), upsertMetadataRequestPayload.getId());
            metadataList = MetadataObjectMapper.getMetadataFromJson(subject, upsertMetadataRequestPayload.getData());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new EmptyResponsePayload());
        }

        for(Metadata metadata : metadataList) {
            try {
                stores.storeMetadata(metadata);
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new RequestErrorResponsePayload(e.getMessage()));
            }
        }
        return ResponseEntity.ok(new EmptyResponsePayload());
    }
}

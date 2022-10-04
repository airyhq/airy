package co.airy.core.communication;

import co.airy.avro.communication.Metadata;
import co.airy.core.communication.payload.UpsertMetadataRequestPayload;
import co.airy.model.metadata.MetadataKeys;
import co.airy.model.metadata.MetadataObjectMapper;
import co.airy.model.metadata.Subject;
import co.airy.spring.web.payload.RequestErrorResponsePayload;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.util.List;

import static java.util.stream.Collectors.toList;

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
            metadataList = MetadataObjectMapper.getMetadataFromJson(subject, upsertMetadataRequestPayload.getData())
                    .stream()
                    .peek((metadata) -> metadata.setKey(String.format("%s.%s", MetadataKeys.USER_DATA, metadata.getKey())))
                    .collect(toList());
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }

        for (Metadata metadata : metadataList) {
            try {
                stores.storeMetadata(metadata);
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new RequestErrorResponsePayload(e.getMessage()));
            }
        }
        return ResponseEntity.noContent().build();
    }
}

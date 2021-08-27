package co.airy.core.sources.api;

import co.airy.avro.communication.Source;
import co.airy.core.sources.api.payload.CreateSourceRequestPayload;
import co.airy.core.sources.api.payload.CreateSourceResponsePayload;
import co.airy.core.sources.api.services.SourceToken;
import co.airy.spring.web.payload.RequestErrorResponsePayload;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.time.Instant;

@RestController
public class SourcesController {

    private final Stores stores;
    private final SourceToken sourceToken;

    public SourcesController(Stores stores, SourceToken sourceToken) {
        this.stores = stores;
        this.sourceToken = sourceToken;
    }

    @PostMapping("/sources.create")
    ResponseEntity<?> createSource(@RequestBody @Valid CreateSourceRequestPayload payload) {
        final String token = sourceToken.getSourceToken(payload.getSourceId());
        final Source source = Source.newBuilder()
                .setId(payload.getSourceId())
                .setCreatedAt(Instant.now().toEpochMilli())
                .setToken(token)
                .setName(payload.getName())
                .setImageUrl(payload.getImageUrl())
                .setActionEndpoint(payload.getActionEndpoint())
                .build();

        try {
            stores.storeSource(source);
            return ResponseEntity.ok(CreateSourceResponsePayload.builder()
                    .sourceId(source.getId())
                    .token(source.getToken())
                    .actionEndpoint(source.getActionEndpoint())
                    .name(source.getName())
                    .imageUrl(source.getImageUrl())
                    .build()
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new RequestErrorResponsePayload(e.getMessage()));
        }
    }

}

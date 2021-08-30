package co.airy.core.sources.api;

import co.airy.avro.communication.Source;
import co.airy.core.sources.api.payload.CreateSourceRequestPayload;
import co.airy.core.sources.api.payload.DeleteSourceRequestPayload;
import co.airy.core.sources.api.payload.ListSourceResponsePayload;
import co.airy.core.sources.api.payload.SourceResponsePayload;
import co.airy.core.sources.api.services.SourceToken;
import co.airy.spring.web.payload.RequestErrorResponsePayload;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@RestController
public class SourcesController {

    private final Stores stores;
    private final SourceToken sourceToken;

    public SourcesController(Stores stores, SourceToken sourceToken) {
        this.stores = stores;
        this.sourceToken = sourceToken;
    }

    @PostMapping("/sources.create")
    ResponseEntity<?> createSource(@RequestBody @Valid CreateSourceRequestPayload payload, Authentication authentication) {
        sourceToken.rejectSourceAuth(authentication);
        if (stores.getSource(payload.getSourceId()) != null) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(new RequestErrorResponsePayload("Source already exists"));
        }

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
            return ResponseEntity.ok(SourceResponsePayload.builder()
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

    @PostMapping("/sources.update")
    ResponseEntity<?> updateSource(@RequestBody @Valid CreateSourceRequestPayload payload, Authentication authentication) {
        sourceToken.rejectSourceAuth(authentication);

        final Source source = stores.getSource(payload.getSourceId());
        if (source == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        source.setActionEndpoint(payload.getActionEndpoint());
        source.setImageUrl(payload.getImageUrl());
        source.setName(payload.getName());

        try {
            stores.storeSource(source);
            return ResponseEntity.ok(SourceResponsePayload.builder()
                    .sourceId(source.getId())
                    .actionEndpoint(source.getActionEndpoint())
                    .name(source.getName())
                    .imageUrl(source.getImageUrl())
                    .build()
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new RequestErrorResponsePayload(e.getMessage()));
        }
    }

    @PostMapping("/sources.list")
    ResponseEntity<?> listSources(Authentication authentication) {
        sourceToken.rejectSourceAuth(authentication);
        final List<Source> allSources = stores.getAllSources();
        return ResponseEntity.ok(
                ListSourceResponsePayload.builder().data(allSources.stream().map((source ->
                        SourceResponsePayload.builder()
                                .sourceId(source.getId())
                                .actionEndpoint(source.getActionEndpoint())
                                .name(source.getName())
                                .imageUrl(source.getImageUrl())
                                .build()
                )).collect(Collectors.toList())).build()
        );
    }

    @PostMapping("/sources.delete")
    ResponseEntity<?> deleteSource(@RequestBody @Valid DeleteSourceRequestPayload payload, Authentication authentication) {
        sourceToken.rejectSourceAuth(authentication);
        try {
            stores.deleteSource(payload.getSourceId());
            return ResponseEntity.accepted().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new RequestErrorResponsePayload(e.getMessage()));
        }
    }
}

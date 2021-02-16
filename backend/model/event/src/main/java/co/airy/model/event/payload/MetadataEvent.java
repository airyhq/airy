package co.airy.model.event.payload;

import co.airy.avro.communication.Metadata;
import co.airy.model.metadata.dto.MetadataMap;
import co.airy.model.metadata.Subject;
import com.fasterxml.jackson.databind.JsonNode;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.Map;

import static co.airy.model.metadata.MetadataObjectMapper.getMetadataPayload;
import static co.airy.model.metadata.MetadataRepository.getSubject;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = false)
public class MetadataEvent extends Event implements Serializable {
    private MetadataEventPayload payload;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MetadataEventPayload {
        private String subject;
        private String identifier;
        private JsonNode metadata;
    }

    public static MetadataEvent fromMetadataMap(MetadataMap metadataMap) {
        final Metadata someMetadata = metadataMap.values().iterator().next();
        final Subject subject = getSubject(someMetadata);
        return new MetadataEvent(
                MetadataEventPayload.builder()
                        .subject(subject.getNamespace())
                        .identifier(subject.getIdentifier())
                        .metadata(getMetadataPayload(metadataMap))
                        .build()
        );
    }
}

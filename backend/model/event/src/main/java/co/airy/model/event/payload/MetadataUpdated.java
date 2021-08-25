package co.airy.model.event.payload;

import co.airy.avro.communication.Metadata;
import co.airy.model.metadata.Subject;
import co.airy.model.metadata.dto.MetadataMap;
import com.fasterxml.jackson.databind.JsonNode;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.io.Serializable;

import static co.airy.model.metadata.MetadataObjectMapper.getMetadataPayload;
import static co.airy.model.metadata.MetadataRepository.getSubject;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = false)
public class MetadataUpdated extends Event implements Serializable {
    private MetadataEventPayload payload;
    private Long timestamp;

    @Override
    public EventType getTypeId() {
        return EventType.METADATA_UPDATED;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MetadataEventPayload {
        private String subject;
        private String identifier;
        private JsonNode metadata;
    }

    public static MetadataUpdated fromMetadataMap(MetadataMap metadataMap) {
        final Metadata someMetadata = metadataMap.values().iterator().next();
        final Subject subject = getSubject(someMetadata);
        return new MetadataUpdated(
                MetadataEventPayload.builder()
                        .subject(subject.getNamespace())
                        .identifier(subject.getIdentifier())
                        .metadata(getMetadataPayload(metadataMap))
                        .build(),
                metadataMap.getUpdatedAt()
        );
    }
}

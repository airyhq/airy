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
public class ComponentUpdated extends Event implements Serializable {
    private ComponentUpdatedEventPayload payload;
    private Long timestamp;

    @Override
    public EventType getTypeId() {
        return EventType.COMPONENTS_UPDATED;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ComponentUpdatedEventPayload {
        private String subject;
        private String identifier;
        private JsonNode metadata;
    }

    public static ComponentUpdated fromComponentUpdateMap(MetadataMap metadataMap) {
        final Metadata someMetadata = metadataMap.values().iterator().next();
        final Subject subject = getSubject(someMetadata);
        return new ComponentUpdated(
                ComponentUpdatedEventPayload.builder()
                        .subject(subject.getNamespace())
                        .identifier(subject.getIdentifier())
                        .metadata(getMetadataPayload(metadataMap))
                        .build(),
                metadataMap.getUpdatedAt());
    }
}

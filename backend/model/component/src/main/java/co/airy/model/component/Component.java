package co.airy.model.component;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import java.util.Collection;
import java.util.Optional;

import com.fasterxml.jackson.annotation.JsonIgnore;

import org.slf4j.Logger;

import co.airy.avro.communication.Metadata;
import co.airy.log.AiryLoggerFactory;
import co.airy.model.metadata.dto.MetadataMap;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import static co.airy.model.component.Component.MetadataKeys.INSTALLATION_STATUS;
import static co.airy.model.component.MetadataRepository.newComponentMetadata;
import static co.airy.model.metadata.MetadataRepository.getSubject;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Component implements Serializable {
    private static final Logger log = AiryLoggerFactory.getLogger(Component.class);

    private String componentName;
    private String installationStatus;

    public static class MetadataKeys {
        public static String INSTALLATION_STATUS = "installationStatus";
    }

    @JsonIgnore
    public List<Metadata> toMetadata() {
        List<Metadata> metadata = new ArrayList<>();
        if (installationStatus != null) {
            metadata.add(newComponentMetadata(componentName, INSTALLATION_STATUS, installationStatus));
        }

        return metadata;
    }

    public static Component fromMetadataMap(MetadataMap map) {
        if (map == null) {
            return null;
        }

        final Collection<Metadata> values = map.values();

        final Optional<Metadata> anyRecord = values.stream().findAny();
        if (anyRecord.isEmpty()) {
            return null;
        }

        final String componentName = getSubject(anyRecord.get()).getIdentifier();

        return Component.builder()
            .componentName(componentName)
            .installationStatus(map.getMetadataValue(INSTALLATION_STATUS))
            .build();
    }
}

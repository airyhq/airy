package co.airy.model.metadata.dto;

import co.airy.avro.communication.Metadata;
import co.airy.log.AiryLoggerFactory;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.slf4j.Logger;

import java.io.Serializable;
import java.time.Instant;
import java.util.Collection;
import java.util.HashMap;
import java.util.Optional;

@Data
@EqualsAndHashCode(callSuper = true)
public class MetadataMap extends HashMap<String, Metadata> implements Serializable {
    private Long updatedAt;
    private static final Logger log = AiryLoggerFactory.getLogger(MetadataMap.class);

    // Convenience methods for aggregating on Metadata in Kafka Streams
    public static MetadataMap adder(String key, Metadata metadata, MetadataMap aggregate) {
        aggregate.put(metadata.getKey(), metadata);
        aggregate.setUpdatedAt(metadata.getTimestamp().toEpochMilli());
        return aggregate;
    }

    public static MetadataMap subtractor(String key, Metadata metadata, MetadataMap aggregate) {
        aggregate.remove(metadata.getKey());
        aggregate.setUpdatedAt(Instant.now().toEpochMilli());
        return aggregate;
    }

    @JsonProperty
    public long getUpdatedAt() {
        return Optional.ofNullable(updatedAt)
                // Backwards compatible for maps that have not recorded this value yet
                .orElseGet(() -> values()
                        .stream()
                        .map(Metadata::getTimestamp)
                        .mapToLong(Instant::toEpochMilli)
                        .max().orElse(0L));
    }

    public Integer getMetadataNumericValue(String key, Integer parseExceptionDefault) {
        final String value = getMetadataValue(key);
        if (value == null) {
            return parseExceptionDefault;
        }

        try {
            return Integer.parseInt(value);
        } catch (Exception e) {
            log.error("Tried to read metadata map key {} as number. Returning default.", key, e);
            return parseExceptionDefault;
        }
    }

    public String getMetadataValue(String key) {
        final Metadata metadata = get(key);
        return metadata == null ? null : metadata.getValue();
    }


    public static MetadataMap from(Collection<Metadata> metadataList) {
        final MetadataMap metadataMap = new MetadataMap();
        for (Metadata metadata : metadataList) {
            metadataMap.put(metadata.getKey(), metadata);
        }
        return metadataMap;
    }
}

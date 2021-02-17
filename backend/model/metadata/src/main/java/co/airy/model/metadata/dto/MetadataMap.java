package co.airy.model.metadata.dto;

import co.airy.avro.communication.Metadata;
import co.airy.log.AiryLoggerFactory;
import co.airy.model.metadata.MetadataKeys;
import org.slf4j.Logger;

import java.io.Serializable;
import java.util.Collection;
import java.util.HashMap;

public class MetadataMap extends HashMap<String, Metadata> implements Serializable {
    private static final Logger log = AiryLoggerFactory.getLogger(MetadataMap.class);

    // Convenience methods for aggregating on Metadata in Kafka Streams
    public static MetadataMap adder(String key, Metadata metadata, MetadataMap aggregate) {
        aggregate.put(metadata.getKey(), metadata);
        return aggregate;
    }

    public static MetadataMap subtractor(String key, Metadata metadata, MetadataMap aggregate) {
        aggregate.remove(metadata.getKey());
        return aggregate;
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

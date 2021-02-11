package co.airy.model.metadata.dto;

import co.airy.avro.communication.Metadata;

import java.io.Serializable;
import java.util.Collection;
import java.util.HashMap;

public class MetadataMap extends HashMap<String, Metadata> implements Serializable {
    // Convenience methods for aggregating on Metadata in Kafka Streams
    public static MetadataMap adder(String key, Metadata metadata, MetadataMap aggregate) {
        aggregate.put(metadata.getKey(), metadata);
        return aggregate;
    }
    public static MetadataMap subtractor(String key, Metadata metadata, MetadataMap aggregate) {
        aggregate.remove(metadata.getKey());
        return aggregate;
    }

    public static MetadataMap from(Collection<Metadata> metadataList) {
        final MetadataMap metadataMap = new MetadataMap();
        for (Metadata metadata : metadataList) {
            metadataMap.put(metadata.getKey(), metadata);
        }
        return metadataMap;
    }
}

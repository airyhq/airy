package co.airy.kafka.streams;

import org.apache.kafka.common.serialization.Serializer;
import org.apache.kafka.streams.state.StreamsMetadata;

public class MetadataService {
    private final KafkaStreamsWrapper streams;

    public MetadataService(final KafkaStreamsWrapper streams) {
        this.streams = streams;
    }

    private <K> HostStoreInfo streamsMetadataForStoreAndKey(final String store,
                                                            final K key,
                                                            final Serializer<K> serializer) {
        // Get metadata for the instances of this Kafka KafkaStreamsWrapper application hosting the store and
        // potentially the value for key
        final StreamsMetadata metadata = streams.metadataForKey(store, key, serializer);
        if (metadata == null) {
            throw new StoreNotFoundException(store);
        }

        if (notReady(metadata)) {
            throw new StoreNotReadyException(store);
        }

        return new HostStoreInfo(metadata.host(), metadata.port());
    }

    private boolean notReady(final StreamsMetadata metadata) {
        return StreamsMetadata.NOT_AVAILABLE.host().equals(metadata.host()) && StreamsMetadata.NOT_AVAILABLE.port() == metadata.port();
    }
}


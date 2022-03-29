package co.airy.kafka.streams;

import org.apache.kafka.common.serialization.Serializer;
import org.apache.kafka.streams.KeyQueryMetadata;

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
        final KeyQueryMetadata metadata = streams.keyQueryMetadata(store, key, serializer);
        if (metadata == null) {
            throw new StoreNotFoundException(store);
        }

        if (notReady(metadata)) {
            throw new StoreNotReadyException(store);
        }

        return new HostStoreInfo(metadata.activeHost().host(), metadata.activeHost().port());
    }

    private boolean notReady(final KeyQueryMetadata metadata) {
        return KeyQueryMetadata.NOT_AVAILABLE.activeHost().equals(metadata.activeHost()) && KeyQueryMetadata.NOT_AVAILABLE.activeHost().port() == metadata.activeHost().port();
    }
}


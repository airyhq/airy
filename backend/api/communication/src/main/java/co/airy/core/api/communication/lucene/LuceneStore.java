package co.airy.core.api.communication.lucene;

import org.apache.kafka.streams.processor.StateStore;

public interface LuceneStore<K, V> extends StateStore, ReadOnlyLuceneStore<K, V> {
    void put(V v);
    void delete(K k);
}

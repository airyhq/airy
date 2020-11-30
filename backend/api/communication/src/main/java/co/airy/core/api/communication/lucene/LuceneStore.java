package co.airy.core.api.communication.lucene;

import java.io.IOException;

public interface LuceneStore<K, V> extends ReadOnlyLuceneStore<K, V> {
    void put(V v) throws IOException;
    void delete(K k) throws IOException;
}

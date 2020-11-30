package co.airy.core.api.communication.lucene;

import org.apache.lucene.search.Query;

import java.util.List;

public interface ReadOnlyLuceneStore<K, V> {
    List<String> query(Query query);
}

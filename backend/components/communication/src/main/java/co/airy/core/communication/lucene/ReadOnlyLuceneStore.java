package co.airy.core.communication.lucene;

import co.airy.core.communication.dto.LuceneQueryResult;
import org.apache.lucene.search.Query;

public interface ReadOnlyLuceneStore {
    LuceneQueryResult query(Query query, int cursor, int pageSize);
}

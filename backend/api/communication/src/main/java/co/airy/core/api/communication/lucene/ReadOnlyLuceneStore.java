package co.airy.core.api.communication.lucene;

import co.airy.core.api.communication.dto.LuceneQueryResult;
import org.apache.lucene.search.Query;

public interface ReadOnlyLuceneStore {
    LuceneQueryResult query(Query query);
}

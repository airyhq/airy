package co.airy.core.api.communication.lucene;

import co.airy.core.api.communication.dto.Conversation;
import co.airy.core.api.communication.dto.LuceneQueryResult;
import co.airy.log.AiryLoggerFactory;
import org.apache.kafka.streams.KeyValue;
import org.apache.kafka.streams.processor.AbstractNotifyingBatchingRestoreCallback;
import org.apache.kafka.streams.processor.ProcessorContext;
import org.apache.kafka.streams.processor.StateStore;
import org.apache.kafka.streams.state.QueryableStoreType;
import org.apache.kafka.streams.state.StoreBuilder;
import org.apache.kafka.streams.state.internals.StateStoreProvider;
import org.apache.lucene.analysis.standard.StandardAnalyzer;
import org.apache.lucene.document.Document;
import org.apache.lucene.index.DirectoryReader;
import org.apache.lucene.index.IndexWriter;
import org.apache.lucene.index.IndexWriterConfig;
import org.apache.lucene.index.Term;
import org.apache.lucene.search.IndexSearcher;
import org.apache.lucene.search.Query;
import org.apache.lucene.search.ScoreDoc;
import org.apache.lucene.search.TopDocs;
import org.apache.lucene.store.FSDirectory;
import org.slf4j.Logger;

import java.io.IOException;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import static java.util.stream.Collectors.toList;

public class LuceneDiskStoreWrapper implements ReadOnlyLuceneStore<String, Conversation> {
    private final QueryableStoreType<ReadOnlyLuceneStore<String, Conversation>> customStoreType;
    private final String storeName;
    private final StateStoreProvider provider;

    public LuceneDiskStoreWrapper(final StateStoreProvider provider,
                                  final String storeName,
                                  final QueryableStoreType<ReadOnlyLuceneStore<String, Conversation>> customStoreType) {
        this.provider = provider;
        this.storeName = storeName;
        this.customStoreType = customStoreType;
    }

    @Override
    public LuceneQueryResult query(Query query, String cursor) {
        final List<ReadOnlyLuceneStore<String, Conversation>> stores = provider.stores(storeName, customStoreType);

        // Collect search results from all stores
        return stores.stream().map(store -> store.query(query, cursor)).findFirst().get();
    }
}

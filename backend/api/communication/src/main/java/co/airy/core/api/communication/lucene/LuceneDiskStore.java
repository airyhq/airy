package co.airy.core.api.communication.lucene;

import co.airy.core.api.communication.dto.Conversation;
import co.airy.core.api.communication.dto.LuceneQueryResult;
import co.airy.core.api.communication.payload.ResponseMetadata;
import co.airy.log.AiryLoggerFactory;
import org.apache.kafka.streams.KeyValue;
import org.apache.kafka.streams.processor.AbstractNotifyingBatchingRestoreCallback;
import org.apache.kafka.streams.processor.ProcessorContext;
import org.apache.kafka.streams.processor.StateStore;
import org.apache.kafka.streams.state.StoreBuilder;
import org.apache.lucene.analysis.core.WhitespaceAnalyzer;
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

import static java.util.stream.Collectors.toList;

public class LuceneDiskStore implements LuceneStore<String, Conversation> {
    private static final Logger log = AiryLoggerFactory.getLogger(LuceneDiskStore.class);

    final String name;
    static IndexWriter writer;
    final DocumentMapper documentMapper;
    ProcessorContext initialProcessorContext;
    DirectoryReader reader;

    private final boolean testMode;

    public LuceneDiskStore(String name) throws IOException {
        this.name = name;
        testMode = System.getenv("TEST_TARGET") != null;

        // Share one writer
        // TODO pass this as a dependency
        if (writer == null || !writer.isOpen()) {
            FSDirectory dir = FSDirectory.open(Paths.get(testMode ? System.getenv("TEST_TMPDIR") : "/tmp/lucene"));
            IndexWriterConfig config = new IndexWriterConfig(new WhitespaceAnalyzer());
            writer = new IndexWriter(dir, config);
        }
        reader = DirectoryReader.open(writer, true, true);
        this.documentMapper = new DocumentMapper();
    }

    @Override
    public String name() {
        return name;
    }

    @Override
    public void init(ProcessorContext context, StateStore stateStore) {
        initialProcessorContext = context;
        context.register(stateStore, new LuceneRestoreCallback(this));
    }

    @Override
    public void flush() {
        try {
            writer.commit();
        } catch (IOException e) {
            log.error("Failed to flush Lucene store", e);
        }
    }

    @Override
    public void close() {
        try {
            writer.close();
        } catch (IOException e) {
            log.error("Failed to close Lucene store", e);
        }
    }

    @Override
    public boolean persistent() {
        return true;
    }

    @Override
    public boolean isOpen() {
        return writer.isOpen();
    }

    @Override
    public void put(Conversation conversation) {
        final Document document = this.documentMapper.fromConversation(conversation);
        try {
            log.info("Indexing document {}", document);
            writer.updateDocument(new Term("conversation.id", conversation.getId()), document);
        } catch (IOException e) {
            // TODO throw runtime exception?
            log.error("Failed to index Lucene document", e);
        }
    }

    public void writeAll(final Collection<KeyValue<byte[], byte[]>> records) {
        final List<Document> documents = records.stream()
                .map((kvPair) -> this.documentMapper.fromBytes(kvPair.value)).collect(toList());

        try {
            writer.addDocuments(documents);
        } catch (IOException e) {
            // TODO throw runtime exception?
            log.error("Failed to batch index Lucene document", e);
        }
    }

    @Override
    public void delete(String id) {
        try {
            writer.deleteDocuments(new Term("id", id));
        } catch (IOException e) {
            log.error("Failed to close Lucene store", e);
        }
    }

    @Override
    public LuceneQueryResult query(Query query) {
        try {
            refreshReader();
            final IndexSearcher indexSearcher = new IndexSearcher(reader);
            final TopDocs topDocs = indexSearcher.search(query, Integer.MAX_VALUE);

            List<Conversation> conversations = new ArrayList<>();
            for (ScoreDoc scoreDoc : topDocs.scoreDocs) {
                final Document doc = indexSearcher.doc(scoreDoc.doc);
                conversations.add(documentMapper.fromDocument(doc));
            }

            return LuceneQueryResult.builder()
                    .conversations(conversations)
                    .total(reader.maxDoc())
                    .build();
        } catch (Exception e) {
            log.error("Failed to query Lucene store with query {}", query, e);
            return LuceneQueryResult.builder().conversations(List.of())
                    .total(reader.maxDoc())
                    .build();
        }
    }

    private void refreshReader() throws IOException {
        final DirectoryReader newReader = DirectoryReader.openIfChanged(reader, writer);
        if (newReader != null && newReader != reader) {
            reader.close();
            reader = newReader;
        }
    }

    static class LuceneRestoreCallback extends AbstractNotifyingBatchingRestoreCallback {

        private final LuceneDiskStore luceneDiskStore;

        LuceneRestoreCallback(final LuceneDiskStore luceneDiskStore) {
            this.luceneDiskStore = luceneDiskStore;
        }

        @Override
        public void restoreAll(final Collection<KeyValue<byte[], byte[]>> records) {
            luceneDiskStore.writeAll(records);
        }
    }

    public static class Builder implements StoreBuilder<LuceneDiskStore> {
        final String name;

        public Builder(String name) {
            this.name = name;
        }

        @Override
        public StoreBuilder<LuceneDiskStore> withCachingEnabled() {
            return this;
        }

        @Override
        public StoreBuilder<LuceneDiskStore> withCachingDisabled() {
            return this;
        }

        @Override
        public StoreBuilder<LuceneDiskStore> withLoggingEnabled(Map<String, String> config) {
            return this;
        }

        @Override
        public StoreBuilder<LuceneDiskStore> withLoggingDisabled() {
            return this;
        }

        @Override
        public LuceneDiskStore build() {
            try {
                return new LuceneDiskStore(name);
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        }

        @Override
        public Map<String, String> logConfig() {
            return Map.of();
        }

        @Override
        public boolean loggingEnabled() {
            return false;
        }

        @Override
        public String name() {
            return this.name;
        }
    }
}

package co.airy.core.api.communication.lucene;

import co.airy.core.api.communication.dto.Conversation;
import co.airy.core.api.communication.dto.LuceneQueryResult;
import co.airy.log.AiryLoggerFactory;
import org.apache.kafka.streams.KeyValue;
import org.apache.kafka.streams.processor.AbstractNotifyingBatchingRestoreCallback;
import org.apache.kafka.streams.processor.ProcessorContext;
import org.apache.kafka.streams.processor.StateStore;
import org.apache.kafka.streams.state.StoreBuilder;
import org.apache.lucene.index.IndexWriter;
import org.apache.lucene.search.Query;
import org.slf4j.Logger;

import java.io.IOException;
import java.util.Collection;
import java.util.Map;

public class LuceneDiskStore implements StateStore, LuceneStore<String, Conversation> {
    private static final Logger log = AiryLoggerFactory.getLogger(LuceneDiskStore.class);

    final String name;
    final LuceneProvider lucene;
    ProcessorContext initialProcessorContext;

    public LuceneDiskStore(String name, LuceneProvider provider) {
        this.name = name;
        this.lucene = provider;
    }

    private IndexWriter getWriter() {
        return lucene.getWriter();
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
            getWriter().flush();
        } catch (IOException e) {
            log.error("Failed to flush Lucene store", e);
        }
    }

    @Override
    public void close() {
        try {
            getWriter().flush();
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
        return getWriter().isOpen();
    }

    @Override
    public void put(Conversation conversation) throws IOException {
        lucene.put(conversation);
    }

    public void writeAll(final Collection<KeyValue<byte[], byte[]>> records) {
        try {
            lucene.writeAll(records);
        } catch (IOException e) {
            // TODO throw runtime exception?
            log.error("Failed to batch index Lucene document", e);
        }
    }

    @Override
    public void delete(String id) throws IOException {
        lucene.delete(id);
    }

    @Override
    public LuceneQueryResult query(Query query) {
        return lucene.query(query);
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
        final LuceneProvider provider;

        public Builder(String name, LuceneProvider provider) {
            this.name = name;
            this.provider = provider;
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
            return new LuceneDiskStore(name, provider);
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
            return name;
        }
    }
}

package co.airy.core.api.communication.lucene;

import co.airy.core.api.communication.dto.ConversationIndex;
import co.airy.core.api.communication.dto.LuceneQueryResult;
import co.airy.kafka.core.serdes.KafkaHybridSerde;
import co.airy.kafka.core.serializer.KafkaJacksonSerializer;
import co.airy.log.AiryLoggerFactory;
import org.apache.kafka.common.serialization.Serdes;
import org.apache.kafka.common.utils.Bytes;
import org.apache.kafka.streams.KeyValue;
import org.apache.kafka.streams.processor.AbstractNotifyingBatchingRestoreCallback;
import org.apache.kafka.streams.processor.ProcessorContext;
import org.apache.kafka.streams.processor.StateStore;
import org.apache.kafka.streams.processor.internals.ProcessorStateManager;
import org.apache.kafka.streams.state.StateSerdes;
import org.apache.kafka.streams.state.StoreBuilder;
import org.apache.lucene.index.IndexWriter;
import org.apache.lucene.search.Query;
import org.slf4j.Logger;

import java.io.IOException;
import java.io.Serializable;
import java.util.Collection;
import java.util.Map;

public class LuceneDiskStore implements StateStore, LuceneStore {
    private static final Logger log = AiryLoggerFactory.getLogger(LuceneDiskStore.class);

    final String name;
    final LuceneProvider lucene;
    ProcessorContext initialProcessorContext;
    StoreChangeLogger<String, Serializable> changeLogger;

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
        final String topic = ProcessorStateManager.storeChangelogTopic(context.applicationId(), name());
        changeLogger = new StoreChangeLogger<>(
                name(),
                context,
                new StateSerdes<>(topic, Serdes.String(), new KafkaHybridSerde()));

        initialProcessorContext = context;

        context.register(stateStore, (key, value) -> {
            // Restoration callback
            try {
                final ConversationIndex conversation = (ConversationIndex) context.valueSerde().deserializer().deserialize(topic, value);
                lucene.put(conversation);
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        });
    }

    void log(final String key,
             final Serializable value) {
        changeLogger.logChange(key, value);
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
            getWriter().close();
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
    public void put(ConversationIndex conversationIndex) throws IOException {
        lucene.put(conversationIndex);
        log(conversationIndex.getId(), conversationIndex);
    }

    @Override
    public void delete(String id) throws IOException {
        lucene.delete(id);
        log(id, null);
    }

    @Override
    public LuceneQueryResult query(Query query) {
        return lucene.query(query);
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
            return true;
        }

        @Override
        public String name() {
            return name;
        }
    }
}

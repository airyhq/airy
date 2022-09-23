package co.airy.core.communication.lucene;

import co.airy.core.communication.dto.ConversationIndex;
import co.airy.model.conversation.Conversation;
import org.apache.kafka.streams.processor.Processor;
import org.apache.kafka.streams.processor.ProcessorContext;
import org.apache.kafka.streams.processor.ProcessorSupplier;

import java.io.IOException;

public class IndexingProcessor implements Processor<String, Conversation> {

    private ProcessorContext context;
    private LuceneStore store;
    private final String storeName;

    public IndexingProcessor(String storeName) {
        this.storeName = storeName;
    }

    @Override
    public void init(ProcessorContext context) {
        this.context = context;
        this.store = (LuceneStore) context.getStateStore(this.storeName);
    }

    @Override
    public void process(String key, Conversation value) {
        try {
            if (value == null) {
                store.delete(key);
            } else {
                store.put(ConversationIndex.fromConversation(value));
            }
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        context.forward(key, value);
    }

    @Override
    public void close() {
    }

    public static ProcessorSupplier<String, Conversation> getSupplier(String luceneStoreName) {
        return () -> new IndexingProcessor(luceneStoreName);
    }
}

package co.airy.core.api.communication.lucene;

import co.airy.core.api.communication.dto.Conversation;
import org.apache.kafka.streams.processor.StateStore;
import org.apache.kafka.streams.state.QueryableStoreType;
import org.apache.kafka.streams.state.internals.StateStoreProvider;

public class LuceneDiskStoreType implements QueryableStoreType<ReadOnlyLuceneStore<String, Conversation>> {
    @Override
    public boolean accepts(StateStore stateStore) {
        return stateStore instanceof LuceneDiskStore;
    }

    @Override
    public ReadOnlyLuceneStore<String, Conversation> create(StateStoreProvider storeProvider, String storeName) {
        return new LuceneDiskStoreWrapper(storeProvider, storeName, this);
    }
}

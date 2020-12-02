package co.airy.core.api.communication.lucene;

import co.airy.core.api.communication.dto.ConversationIndex;

import java.io.IOException;

public interface LuceneStore extends ReadOnlyLuceneStore {
    void put(ConversationIndex conversation) throws IOException;
    void delete(String id) throws IOException;
}

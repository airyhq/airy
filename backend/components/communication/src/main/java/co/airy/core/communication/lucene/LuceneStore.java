package co.airy.core.communication.lucene;

import co.airy.core.communication.dto.ConversationIndex;

import java.io.IOException;

public interface LuceneStore extends ReadOnlyLuceneStore {
    void put(ConversationIndex conversation) throws IOException;
    void delete(String id) throws IOException;
}

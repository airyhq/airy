package co.airy.core.api.communication.lucene;

import co.airy.avro.communication.Channel;
import co.airy.avro.communication.ChannelConnectionState;
import co.airy.avro.communication.Message;
import co.airy.core.api.communication.dto.Conversation;
import co.airy.core.api.communication.dto.ConversationIndex;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.lucene.document.Document;
import org.apache.lucene.document.Field;
import org.apache.lucene.document.IntPoint;
import org.apache.lucene.document.LongPoint;
import org.apache.lucene.document.StoredField;
import org.apache.lucene.document.StringField;
import org.apache.lucene.document.TextField;
import org.apache.lucene.index.IndexableField;
import org.apache.lucene.util.BytesRef;

import java.io.IOException;
import java.nio.ByteBuffer;
import java.util.Map;

import static java.util.stream.Collectors.toMap;

public class DocumentMapper {
    final ObjectMapper objectMapper = new ObjectMapper();

    public Document fromBytes(byte[] payload) {
        final ConversationIndex conversation;
        try {
            conversation = objectMapper.readValue(payload, ConversationIndex.class);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        return fromConversationIndex(conversation);
    }

    public Document fromConversationIndex(ConversationIndex conversation) {
        final Document document = new Document();
        document.add(new StringField("id", conversation.getId(), Field.Store.YES));

        if (conversation.getDisplayName() != null) {
            document.add(new TextField("display_name", conversation.getDisplayName(), Field.Store.YES));
        }

        document.add(new LongPoint("createdAt", conversation.getCreatedAt()));
        document.add(new StoredField("createdAt", conversation.getCreatedAt()));
        document.add(new IntPoint("unreadCount", conversation.getUnreadCount()));
        document.add(new StoredField("unreadCount", conversation.getUnreadCount()));

        for (Map.Entry<String, String> entry : conversation.getMetadata().entrySet()) {
            document.add(new TextField("metadata." + entry.getKey(), entry.getValue(), Field.Store.YES));
        }

        return document;
    }

    public ConversationIndex fromDocument(Document document) {

        final Long createdAt = document.getField("createdAt").numericValue().longValue();
        final Integer unreadCount = document.getField("unreadCount").numericValue().intValue();

        final Map<String, String> metadata = document.getFields().stream()
                .filter((field) -> field.name().startsWith("metadata"))
                .collect(toMap(
                        (field) -> field.name().replace("metadata.", ""),
                        IndexableField::stringValue
                ));

        return ConversationIndex.builder()
                .id(document.get("id"))
                .unreadCount(unreadCount)
                .createdAt(createdAt)
                .metadata(metadata)
                .displayName(document.get("displayName"))
                .build();
    }
}

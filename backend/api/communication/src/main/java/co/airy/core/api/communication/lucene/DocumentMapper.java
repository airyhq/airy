package co.airy.core.api.communication.lucene;

import co.airy.core.api.communication.dto.ConversationIndex;
import co.airy.model.metadata.dto.MetadataNode;
import org.apache.lucene.document.Document;
import org.apache.lucene.document.Field;
import org.apache.lucene.document.IntPoint;
import org.apache.lucene.document.LongPoint;
import org.apache.lucene.document.NumericDocValuesField;
import org.apache.lucene.document.StoredField;
import org.apache.lucene.document.StringField;
import org.apache.lucene.document.TextField;
import org.apache.lucene.index.IndexableField;

import java.util.List;

import static java.util.stream.Collectors.toList;

public class DocumentMapper {
    public Document fromConversationIndex(ConversationIndex conversation) {
        final Document document = new Document();
        document.add(new StringField("id", conversation.getId(), Field.Store.YES));
        document.add(new StringField("channel_id", conversation.getChannelId(), Field.Store.YES));

        if (conversation.getDisplayName() != null) {
            document.add(new TextField("display_name", conversation.getDisplayName(), Field.Store.YES));
        }
        document.add(new StringField("source", conversation.getSource(), Field.Store.YES));

        document.add(new LongPoint("created_at", conversation.getCreatedAt()));
        document.add(new StoredField("created_at", conversation.getCreatedAt()));
        document.add(new IntPoint("unread_count", conversation.getUnreadMessageCount()));
        document.add(new StoredField("unread_count", conversation.getUnreadMessageCount()));

        // sort enabled field
        document.add(new NumericDocValuesField("last_message_at", conversation.getLastMessageAt()));
        for (String tagId : conversation.getTagIds()) {
            document.add(new TextField("tag_ids", tagId, Field.Store.YES));
        }

        for (String noteId : conversation.getNoteIds()) {
            document.add(new TextField("note_ids", noteId, Field.Store.YES));
        }

        for (MetadataNode node : conversation.getMetadata()) {
            final String key = String.format("metadata.%s", node.getKey());
            // Index but don't store metadata
            document.add(new TextField(key, node.getValue(), Field.Store.NO));
        }

        return document;
    }

    public ConversationIndex fromDocument(Document document) {
        final Long createdAt = document.getField("created_at").numericValue().longValue();
        final Integer unreadCount = document.getField("unread_count").numericValue().intValue();

        final List<String> tagIds = document.getFields().stream()
                .filter((field) -> field.name().equals("tag_ids"))
                .map(IndexableField::stringValue)
                .collect(toList());

        final List<String> noteIds = document.getFields().stream()
                .filter((field) -> field.name().equals("note_ids"))
                .map(IndexableField::stringValue)
                .collect(toList());

        return ConversationIndex.builder()
                .id(document.get("id"))
                .unreadMessageCount(unreadCount)
                .createdAt(createdAt)
                .tagIds(tagIds)
                .noteIds(noteIds)
                .displayName(document.get("display_name"))
                .build();
    }
}

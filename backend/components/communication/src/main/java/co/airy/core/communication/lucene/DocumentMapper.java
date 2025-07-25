package co.airy.core.communication.lucene;

import co.airy.core.communication.dto.ConversationIndex;
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
import co.airy.log.AiryLoggerFactory;
import org.slf4j.Logger;

import java.util.List;

import static java.util.stream.Collectors.toList;

public class DocumentMapper {

    private static final Logger log = AiryLoggerFactory.getLogger(DocumentMapper.class);

    public Document fromConversationIndex(ConversationIndex conversation) {
        final Document document = new Document();        

        if (conversation.getId() != null) {
            document.add(new StringField("id", conversation.getId(), Field.Store.YES));
        } else {
            log.error("conversation.getId() is null");            
        }
    
        if (conversation.getChannelId() != null) {
            document.add(new StringField("channel_id", conversation.getChannelId(), Field.Store.YES));
        } else {
            log.error("conversation.getChannelId() is null");            
        }
    
        if (conversation.getDisplayName() != null) {            
            document.add(new TextField("display_name", conversation.getDisplayName(), Field.Store.YES));
        } else {
            log.error("conversation.getDisplayName() is null");            
        }
    
        if (conversation.getSource() != null) {            
            document.add(new StringField("source", conversation.getSource(), Field.Store.YES));
        } else {
            log.error("conversation.getSource() is null");            
        }
    
        if (conversation.getCreatedAt() != null) {            
            document.add(new LongPoint("created_at", conversation.getCreatedAt()));
            document.add(new StoredField("created_at", conversation.getCreatedAt()));
        } else {
            log.error("conversation.getCreatedAt() is null");            
        }
    
        if (conversation.getUnreadMessageCount() != null) {            
            document.add(new IntPoint("unread_count", conversation.getUnreadMessageCount()));
            document.add(new StoredField("unread_count", conversation.getUnreadMessageCount()));
        } else {
            log.error("conversation.getUnreadMessageCount() is null");            
        }
    
        if (conversation.getLastMessageAt() != null) {            
            document.add(new NumericDocValuesField("last_message_at", conversation.getLastMessageAt()));
        } else {
            log.error("conversation.getLastMessageAt() is null");            
        }
    
        if (conversation.getTagIds() != null) {            
            for (String tagId : conversation.getTagIds()) {
                document.add(new TextField("tag_ids", tagId, Field.Store.YES));
            }
        } else {
            log.error("conversation.getTagIds() is null");            
        }
    
        if (conversation.getMetadata() != null) {            
            for (MetadataNode node : conversation.getMetadata()) {                
                final String key = String.format("metadata.%s", node.getKey());
                if (node.getValue() != null) {                    
                    document.add(new TextField(key, node.getValue(), Field.Store.NO));
                } else {                    
                    log.error("Metadata value for key \" + node.getKey() + \" is null");            
                }
            }
        } else {
            log.error("conversation.getMetadata() is null");                
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

        return ConversationIndex.builder()
                .id(document.get("id"))
                .unreadMessageCount(unreadCount)
                .createdAt(createdAt)
                .tagIds(tagIds)
                .displayName(document.get("display_name"))
                .build();
    }
}

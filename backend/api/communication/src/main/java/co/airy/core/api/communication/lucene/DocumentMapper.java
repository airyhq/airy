package co.airy.core.api.communication.lucene;

import co.airy.avro.communication.Channel;
import co.airy.core.api.communication.dto.Conversation;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.lucene.document.Document;
import org.apache.lucene.document.Field;
import org.apache.lucene.document.LongPoint;
import org.apache.lucene.document.StoredField;
import org.apache.lucene.document.StringField;
import org.apache.lucene.document.TextField;

import java.io.IOException;

public class DocumentMapper {
    final ObjectMapper objectMapper = new ObjectMapper();

    public Document fromBytes(byte[] payload) {
        final Conversation conversation;
        try {
            conversation = objectMapper.readValue(payload, Conversation.class);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        return fromConversation(conversation);
    }

    public Document fromConversation(Conversation conversation) {
        final Document document = new Document();
        document.add(new StringField("id", conversation.getId(), Field.Store.YES));
        document.add(new StringField("sourceConversationId", conversation.getSourceConversationId(), Field.Store.YES));

        if (conversation.getDisplayName() != null) {
            document.add(new TextField("display_name", conversation.getDisplayName(), Field.Store.YES));
        }

        document.add(new LongPoint("createdAt", conversation.getCreatedAt()));

        final Channel channel = conversation.getChannel();
        document.add(new StringField("channel.id", channel.getId(), Field.Store.YES));
        document.add(new TextField("channel.name", channel.getName(), Field.Store.YES));
        document.add(new StringField("channel.source", channel.getSource(), Field.Store.YES));
        document.add(new StringField("channel.sourceChannelId", channel.getSourceChannelId(), Field.Store.YES));
        document.add(new StringField("channel.connectionState", channel.getConnectionState().toString(), Field.Store.YES));

        if (channel.getToken() != null) {
            document.add(new StringField("channel.token", channel.getToken(), Field.Store.YES));
        }

        if (channel.getImageUrl() != null) {
            document.add(new StoredField("channel.imageUrl", channel.getImageUrl()));
        }

        // Last message is not searchable
        try {
            document.add(new StoredField("lastMessage", conversation.getLastMessage().toByteBuffer().array()));
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        return document;
    }

    public Conversation fromDocument(Document document) {
        
        return null;
    }
}

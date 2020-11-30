package co.airy.core.api.communication.lucene;

import co.airy.avro.communication.Channel;
import co.airy.avro.communication.ChannelConnectionState;
import co.airy.avro.communication.Message;
import co.airy.core.api.communication.dto.Conversation;
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
        document.add(new StoredField("createdAt", conversation.getCreatedAt()));
        document.add(new IntPoint("unreadCount", conversation.getUnreadCount()));
        document.add(new StoredField("unreadCount", conversation.getUnreadCount()));

        final Channel channel = conversation.getChannel();
        document.add(new StringField("channel.id", channel.getId(), Field.Store.YES));
        document.add(new TextField("channel.name", channel.getName(), Field.Store.YES));
        document.add(new StringField("channel.source", channel.getSource(), Field.Store.YES));
        document.add(new StringField("channel.sourceChannelId", channel.getSourceChannelId(), Field.Store.YES));
        document.add(new StringField("channel.connectionState", channel.getConnectionState().toString(), Field.Store.YES));

        if (channel.getToken() != null) {
            document.add(new StoredField("channel.token", channel.getToken()));
        }

        if (channel.getImageUrl() != null) {
            document.add(new StoredField("channel.imageUrl", channel.getImageUrl()));
        }

        for (Map.Entry<String, String> entry : conversation.getMetadata().entrySet()) {
            document.add(new TextField("metadata." + entry.getKey(), entry.getValue(), Field.Store.YES));
        }

        // Last message is not searchable
        try {
            document.add(new StoredField("lastMessage", conversation.getLastMessage().toByteBuffer().array()));
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        return document;
    }

    public Conversation fromDocument(Document document) throws Exception {

        final Long createdAt = document.getField("createdAt").numericValue().longValue();
        final Integer unreadCount = document.getField("unreadCount").numericValue().intValue();
        final String sourceConversationId = document.get("sourceConversationId");
        final BytesRef lastMessageBytes = document.getBinaryValue("lastMessage");
        final Message lastMessage = Message.fromByteBuffer(ByteBuffer.wrap(lastMessageBytes.bytes));

        final Channel channel = Channel.newBuilder()
                .setId(document.get("channel.id"))
                .setName(document.get("channel.name"))
                .setSource(document.get("channel.source"))
                .setSourceChannelId(document.get("channel.sourceChannelId"))
                .setConnectionState(ChannelConnectionState.valueOf(document.get("channel.connectionState")))
                .setToken(document.get("channel.token"))
                .setImageUrl(document.get("channel.imageUrl"))
                .build();

        final Map<String, String> metadata = document.getFields().stream()
                .filter((field) -> field.name().startsWith("metadata"))
                .collect(toMap(
                        (field) -> field.name().replace("metadata.", ""),
                        IndexableField::stringValue
                ));

        return Conversation.builder()
                .sourceConversationId(sourceConversationId)
                .unreadCount(unreadCount)
                .createdAt(createdAt)
                .lastMessage(lastMessage)
                .channel(channel)
                .metadata(metadata)
                .build();
    }
}

package co.airy.core.api.conversations.dto;

import co.airy.avro.communication.Channel;
import co.airy.avro.communication.Message;
import co.airy.avro.communication.MetadataKeys;
import co.airy.avro.communication.SenderType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Conversation implements Serializable {
    Long createdAt;
    String channelId;
    Message lastMessage;
    String sourceConversationId;
    Channel channel;

    @Builder.Default
    Map<String, String> metadata = new HashMap<>();

    public String getDisplayName() {
        if (this.metadata == null) {
            return null;
        }

        return String.format("%s %s", this.metadata.get(MetadataKeys.SOURCE.CONTACT.FIRST_NAME),
                this.metadata.get(MetadataKeys.SOURCE.CONTACT.LAST_NAME)
        );
    }

    public Long getLastOffset() {
        return this.lastMessage.getOffset();
    }

    public String getId() {
        return this.lastMessage.getConversationId();
    }

    public String getChannelId() {
        return this.lastMessage.getChannelId();
    }
}


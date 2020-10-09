package co.airy.core.api.communication.dto;

import co.airy.avro.communication.Channel;
import co.airy.avro.communication.Message;
import co.airy.avro.communication.MetadataKeys;
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
    private Long createdAt;
    private String channelId;
    private Message lastMessage;
    private String sourceConversationId;
    private  Channel channel;

    Integer unreadCount;

    @Builder.Default
    Map<String, String> metadata = new HashMap<>();

    public String getDisplayName() {
        final String firstName = this.metadata.get(MetadataKeys.SOURCE.CONTACT.FIRST_NAME);
        final String lastName = this.metadata.get(MetadataKeys.SOURCE.CONTACT.LAST_NAME);

        if (firstName == null && lastName == null) {
            return null;
        }

        return String.format("%s %s", firstName, lastName).trim();
    }

    public String getId() {
        return this.lastMessage.getConversationId();
    }

    public String getChannelId() {
        return this.lastMessage.getChannelId();
    }
}


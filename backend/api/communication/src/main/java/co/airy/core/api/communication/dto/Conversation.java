package co.airy.core.api.communication.dto;

import co.airy.avro.communication.Channel;
import co.airy.model.message.dto.MessageContainer;
import co.airy.model.metadata.MetadataKeys;
import co.airy.model.metadata.MetadataRepository;
import co.airy.model.metadata.dto.MetadataMap;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static java.util.stream.Collectors.toList;
import static org.springframework.util.StringUtils.capitalize;

@Data
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
public class Conversation implements Serializable {
    private Long createdAt;
    private MessageContainer lastMessageContainer;
    private String sourceConversationId;
    private Channel channel;

    private Integer unreadMessageCount;

    @Builder.Default
    private MetadataMap metadata = new MetadataMap();

    @JsonIgnore
    public String getDisplayNameOrDefault() {
        String displayName = metadata.getMetadataValue(MetadataKeys.ConversationKeys.Contact.DISPLAY_NAME);

        // Default to a display name that looks like: "Facebook 4ecb3"
        if (displayName == null) {
            return String.format("%s %s", prettifySource(channel.getSource()), getId().substring(31));
        }

        return displayName;
    }

    @JsonIgnore
    public List<String> getTagIds() {
        return metadata.keySet()
                .stream()
                .filter((entry) -> entry.startsWith(MetadataKeys.ConversationKeys.TAGS))
                .map(s -> s.split("\\.")[1])
                .collect(toList());
    }

    /**
     * - Remove the source provider (see docs/getting-started/glossary.md#source-provider)
     * - Capitalize first letter
     * E.g. twilio.sms -> Sms, facebook -> Facebook
     */
    @JsonIgnore
    private String prettifySource(String source) {
        final String[] splits = source.split("\\.");
        source = splits[splits.length - 1];
        return capitalize(source);
    }

    @JsonIgnore
    public String getId() {
        return this.lastMessageContainer.getMessage().getConversationId();
    }

    @JsonIgnore
    public String getChannelId() {
        return this.lastMessageContainer.getMessage().getChannelId();
    }
}

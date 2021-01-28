package co.airy.core.api.communication.dto;

import co.airy.avro.communication.Channel;
import co.airy.model.metadata.MetadataKeys;
import co.airy.model.metadata.MetadataRepository;
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
    private Map<String, String> metadata = new HashMap<>();

    @JsonIgnore
    public DisplayName getDisplayNameOrDefault() {
        String firstName = metadata.get(MetadataKeys.Source.Contact.FIRST_NAME);
        String lastName = metadata.get(MetadataKeys.Source.Contact.LAST_NAME);

        // Default to a display name that looks like: "Facebook 4ecb3"
        if (firstName == null && lastName == null) {
            firstName = prettifySource(channel.getSource());
            lastName = getId().substring(31); // UUIDs have a fixed length of 36
        }

        return new DisplayName(firstName, lastName);
    }

    /**
     * - Remove the source provider (see docs/getting-started/glossary.md#source-provider)
     * - Capitalize first letter
     * E.g. twilio.sms -> Sms, facebook -> Facebook
     */
    private String prettifySource(String source) {
        final String[] splits = source.split("\\.");
        source = splits[splits.length - 1];
        return capitalize(source);
    }

    @JsonIgnore
    public List<String> getTagIds() {
        return MetadataRepository.filterPrefix(metadata, MetadataKeys.TAGS)
                .keySet()
                .stream()
                .map(s -> s.split("\\.")[1])
                .collect(toList());
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

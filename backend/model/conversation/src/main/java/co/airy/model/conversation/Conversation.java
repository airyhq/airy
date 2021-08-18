package co.airy.model.conversation;

import co.airy.avro.communication.Channel;
import co.airy.model.channel.dto.ChannelContainer;
import co.airy.model.message.dto.MessageContainer;
import co.airy.model.metadata.MetadataKeys;
import co.airy.model.metadata.dto.MetadataMap;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.List;
import java.util.Optional;

import static java.util.stream.Collectors.toList;
import static co.airy.text.format.TextFormat.capitalize;

@Data
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
public class Conversation implements Serializable {
    private Long createdAt;
    private MessageContainer lastMessageContainer;
    private String sourceConversationId;
    private ChannelContainer channelContainer;

    @Builder.Default
    private MetadataMap metadataMap = new MetadataMap();

    @JsonIgnore
    public Channel getChannel() {
        return Optional.ofNullable(channelContainer).map(ChannelContainer::getChannel).orElse(null);
    }

    public Integer getUnreadMessageCount() {
        return metadataMap.getMetadataNumericValue(MetadataKeys.ConversationKeys.UNREAD_COUNT, 0);
    }

    @JsonIgnore
    public String getDisplayNameOrDefault() {
        String displayName = metadataMap.getMetadataValue(MetadataKeys.ConversationKeys.Contact.DISPLAY_NAME);

        // Default to a display name that looks like: "Facebook 4ecb3"
        if (displayName == null) {
            return String.format("%s %s", prettifySource(getLastMessageContainer().getMessage().getSource()), getId().substring(31));
        }

        return displayName;
    }

    @JsonIgnore
    public List<String> getTagIds() {
        return metadataMap.keySet()
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

    // Use data from this conversation to create its metadata with defaults
    // I.e. add a "Chatplugin 435de1" display name if there is none
    // We introduced this for better ease of use with frontend client
    public JsonNode defaultMetadata(JsonNode metadata) {
        JsonNode contactNode = metadata.get(MetadataKeys.ConversationKeys.CONTACT) == null ?
                JsonNodeFactory.instance.objectNode() : metadata.get("contact");
        if (contactNode.get(MetadataKeys.ConversationKeys.Contact.DISPLAY_NAME) == null) {
            ((ObjectNode) contactNode).put("display_name", getDisplayNameOrDefault());
            ((ObjectNode) metadata).set("contact", contactNode);
        }

        final JsonNode unreadCount = metadata.get(MetadataKeys.ConversationKeys.UNREAD_COUNT);
        if (unreadCount == null) {
            ((ObjectNode) metadata).put(MetadataKeys.ConversationKeys.UNREAD_COUNT, 0);
        }

        return metadata;
    }
}

package co.airy.model.event.payload;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;

@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, property = "type", include = JsonTypeInfo.As.EXISTING_PROPERTY)
@JsonSubTypes({
        @JsonSubTypes.Type(value = MessageCreated.class, name = "message.created"),
        @JsonSubTypes.Type(value = MessageUpdated.class, name = "message.updated"),
        @JsonSubTypes.Type(value = ConversationUpdated.class, name = "conversation.updated"),
        @JsonSubTypes.Type(value = MetadataUpdated.class, name = "metadata.updated"),
        @JsonSubTypes.Type(value = ChannelUpdated.class, name = "channel.updated"),
        @JsonSubTypes.Type(value = TagEvent.class, name = "tag.updated")
})
public abstract class Event {
    @JsonIgnore
    public abstract EventType getTypeId();

    @JsonProperty
    public String getType() {
        return getTypeId().getEventType();
    }

    @JsonIgnore
    public abstract Long getTimestamp();
}

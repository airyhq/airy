package co.airy.model.event.payload;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;

@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, property = "type", include = JsonTypeInfo.As.EXISTING_PROPERTY)
@JsonSubTypes({
        @JsonSubTypes.Type(value = MessageUpdated.class),
        @JsonSubTypes.Type(value = MetadataUpdated.class),
        @JsonSubTypes.Type(value = ChannelUpdated.class),
        @JsonSubTypes.Type(value = TagEvent.class)
})
public abstract class Event {
    public abstract EventType getType();
}

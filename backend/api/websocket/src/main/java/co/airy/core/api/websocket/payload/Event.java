package co.airy.core.api.websocket.payload;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;

@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.PROPERTY, property = "type")
@JsonSubTypes({
        @JsonSubTypes.Type(value = MessageEvent.class, name = "message"),
        @JsonSubTypes.Type(value = MetadataEvent.class, name = "metadata"),
        @JsonSubTypes.Type(value = ChannelEvent.class, name = "channel")
})
public abstract class Event {
}

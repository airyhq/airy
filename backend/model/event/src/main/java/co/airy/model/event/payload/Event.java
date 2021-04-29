package co.airy.model.event.payload;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;

@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, property = "type")
@JsonSubTypes({
        @JsonSubTypes.Type(value = MessageEvent.class, name = "message"),
        @JsonSubTypes.Type(value = MetadataEvent.class, name = "metadata"),
        @JsonSubTypes.Type(value = ChannelEvent.class, name = "channel"),
        @JsonSubTypes.Type(value = TagEvent.class, name = "tag")
})
public abstract class Event {
}

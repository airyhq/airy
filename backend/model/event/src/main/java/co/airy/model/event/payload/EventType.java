package co.airy.model.event.payload;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum EventType {
    // See https://airy.co/docs/core/api/webhook#events
    MESSAGE_CREATED("message.created"),
    MESSAGE_UPDATED("message.updated"),
    CONVERSATION_UPDATED("conversation.updated"),
    CHANNEL_UPDATED("channel.updated"),
    TAG_UPDATED("tag.updated"),
    METADATA_ITEM("metadata.item"),
    METADATA_UPDATED("metadata.updated"),
    COMPONENTS_UPDATED("components.updated");

    private final String eventType;

    EventType(String eventType) {
        this.eventType = eventType;
    }

    @JsonValue
    public String getEventType() {
        return eventType;
    }

    @JsonCreator
    public static EventType forValue(String value) {
        return EventType.valueOf(value.toUpperCase().replace(".", "_"));
    }
}

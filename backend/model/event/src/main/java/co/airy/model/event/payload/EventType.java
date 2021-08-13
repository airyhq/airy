package co.airy.model.event.payload;

public enum EventType {
    MESSAGE_CREATED("message.created"),
    MESSAGE_UPDATED("message.updated"),
    CONVERSATION_UPDATED("conversation.updated"),
    CHANNEL_UPDATED("channel.updated"),
    TAG_UPDATED("tag.updated"),
    METADATA_UPDATED("metadata.updated");

    private final String eventType;

    EventType(String eventType) {
        this.eventType = eventType;
    }

    public String getEventType() {
        return eventType;
    }
}

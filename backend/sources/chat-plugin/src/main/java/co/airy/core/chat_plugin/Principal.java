package co.airy.core.chat_plugin;

import co.airy.uuid.UUIDv5;
import lombok.Data;

@Data
public class Principal implements java.security.Principal {
    private String channelId;
    private String sessionId;
    private String conversationId;

    public Principal(String channelId, String sessionId) {
        this.channelId = channelId;
        this.sessionId = sessionId;
        this.conversationId = UUIDv5.fromNamespaceAndName(channelId, sessionId).toString();
    }

    @Override
    public String getName() {
        return conversationId;
    }
}

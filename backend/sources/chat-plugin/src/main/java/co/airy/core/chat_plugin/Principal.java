package co.airy.core.chat_plugin;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class Principal implements java.security.Principal {
    private String channelId;
    private String conversationId;

    @Override
    public String getName() {
        return conversationId;
    }
}

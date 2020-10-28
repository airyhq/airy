package co.airy.core.chat_plugin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.io.Serializable;

@Data
@Builder
@AllArgsConstructor
public class Principal implements java.security.Principal {
    private String channelId;
    private String sessionId;

    @Override
    public String getName() {
        return sessionId;
    }
}

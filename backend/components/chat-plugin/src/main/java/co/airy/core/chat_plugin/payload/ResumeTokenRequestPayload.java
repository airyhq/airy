package co.airy.core.chat_plugin.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResumeTokenRequestPayload {
    private String channelId;
    private String conversationId;
}

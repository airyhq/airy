package co.airy.core.chat_plugin.payload;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MessageUpsertPayload implements Serializable {
    private String conversationId;
    private String channelId;
    private MessageResponsePayload message;
}

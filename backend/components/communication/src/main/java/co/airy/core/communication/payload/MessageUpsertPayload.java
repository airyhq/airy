package co.airy.core.communication.payload;

import co.airy.model.message.dto.MessageResponsePayload;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MessageUpsertPayload {
    private String conversationId;
    private String channelId;
    private MessageResponsePayload message;
}

package co.airy.core.api.communication.payload;

import co.airy.payload.response.ChannelPayload;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class ConversationResponsePayload implements Serializable {
    private String id;
    private String createdAt;
    private ChannelPayload channel;
    private ContactResponsePayload contact;
    private MessageResponsePayload message;
    private Integer unreadMessageCount;
}

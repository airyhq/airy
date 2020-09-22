package co.airy.payload.response;

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
    private String state;
    private String createdAt;
    private ChannelPayload channel;
    private ContactResponsePayload contact;
    private MessageResponsePayload message;
    private Long unreadMessageCount;
}

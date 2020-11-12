package co.airy.core.api.communication.payload;

import co.airy.payload.response.ChannelPayload;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ConversationResponsePayload {
    private String id;
    private String createdAt;
    private ChannelPayload channel;
    private List<String> tags;
    private ContactResponsePayload contact;
    private MessageResponsePayload lastMessage;
    private Integer unreadMessageCount;
}

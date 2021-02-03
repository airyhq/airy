package co.airy.core.api.communication.payload;

import co.airy.model.channel.ChannelPayload;
import co.airy.model.message.dto.MessageResponsePayload;
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

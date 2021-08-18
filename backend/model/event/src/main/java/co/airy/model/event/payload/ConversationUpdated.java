package co.airy.model.event.payload;

import co.airy.model.conversation.Conversation;
import co.airy.model.conversation.ConversationPayload;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = false)
public class ConversationUpdated extends Event implements Serializable {
    private ConversationPayload payload;

    @Override
    public EventType getTypeId() {
        return EventType.CONVERSATION_UPDATED;
    }

    public static ConversationUpdated fromConversation(Conversation conversation) {
        return ConversationUpdated.builder()
                .payload(ConversationPayload.fromConversation(conversation))
                .build();
    }
}



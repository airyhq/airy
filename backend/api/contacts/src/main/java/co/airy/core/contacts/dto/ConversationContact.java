package co.airy.core.contacts.dto;

import co.airy.model.conversation.Conversation;
import co.airy.model.metadata.dto.MetadataMap;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ConversationContact implements Serializable {
    private Conversation conversation;
    private MetadataMap contact;
}

package co.airy.core.sources.api.actions.dto;

import co.airy.avro.communication.Message;
import co.airy.avro.communication.Source;
import co.airy.model.conversation.Conversation;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotNull;
import java.io.Serializable;

@Data
@Builder(toBuilder = true)
@AllArgsConstructor
@NoArgsConstructor
public class SendMessage implements Serializable {
    private Conversation conversation;
    private Source source;
    @NotNull
    private Message message;
}

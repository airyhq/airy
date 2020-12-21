package co.airy.core.sources.facebook.dto;

import co.airy.avro.communication.Message;
import co.airy.core.sources.facebook.model.Conversation;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SendMessageRequest implements Serializable {
    private Conversation conversation;
    private Message message;
}

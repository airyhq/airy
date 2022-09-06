package co.airy.core.sources.whatsapp.dto;

import co.airy.avro.communication.Message;
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

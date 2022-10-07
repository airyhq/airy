package co.airy.core.sources.whatsapp.dto;

import co.airy.avro.communication.Channel;
import co.airy.avro.communication.Message;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
public class MessageWithChannel implements Serializable {
    private String sourceMessageId;
    private Message message;
    private Channel channel;
}

package co.airy.core.sources.facebook.model;

import co.airy.avro.communication.Channel;
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
    String sourceConversationId;
    String channelId;

    Message message;
    Channel channel;
}

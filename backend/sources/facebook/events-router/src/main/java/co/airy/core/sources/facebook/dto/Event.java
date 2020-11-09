package co.airy.core.sources.facebook.dto;

import co.airy.avro.communication.Channel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder(toBuilder = true)
public class Event implements Serializable {
    private String sourceConversationId;
    private String payload;
    private Channel channel;
}

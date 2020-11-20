package co.airy.core.sources.twilio;

import co.airy.avro.communication.Channel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder(toBuilder = true)
public class TwilioEventInfo implements Serializable {
    private String to;
    private String from;
    private String payload;
    private Channel channel;
    private Long timestamp;
}

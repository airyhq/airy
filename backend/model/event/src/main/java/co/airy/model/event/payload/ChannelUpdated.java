package co.airy.model.event.payload;

import co.airy.avro.communication.Channel;
import co.airy.model.channel.ChannelPayload;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@Builder
@EqualsAndHashCode(callSuper = false)
public class ChannelUpdated extends Event implements Serializable {
    private ChannelPayload payload;

    public static ChannelUpdated fromChannel(Channel channel) {
        return builder().payload(ChannelPayload.fromChannel(channel)).build();
    }

    @Override
    public EventType getType() {
        return EventType.CHANNEL_UPDATED;
    }
}

package co.airy.model.event.payload;

import co.airy.avro.communication.Channel;
import co.airy.model.channel.ChannelPayload;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = false)
public class ChannelUpdated extends Event implements Serializable {
    private ChannelPayload payload;
    private Long timestamp;

    public static ChannelUpdated fromChannel(Channel channel) {
        return builder().timestamp(Instant.now().toEpochMilli()) // TODO record channel update date
                .payload(ChannelPayload.fromChannel(channel)).build();
    }

    @Override
    public EventType getTypeId() {
        return EventType.CHANNEL_UPDATED;
    }
}

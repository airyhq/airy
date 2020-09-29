package co.airy.core.api.admin;

import co.airy.avro.communication.Channel;
import co.airy.payload.response.ChannelPayload;

public class Mapper {
    public static ChannelPayload fromChannel(Channel channel) {
        return ChannelPayload.builder()
                .name(channel.getName())
                .id(channel.getId())
                .imageUrl(channel.getImageUrl())
                .source(channel.getSource())
                .sourceChannelId(channel.getSourceChannelId())
                .build();
    }
}

package co.airy.model.channel;

import co.airy.avro.communication.Channel;
import co.airy.model.channel.dto.ChannelContainer;
import com.fasterxml.jackson.databind.JsonNode;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import static co.airy.model.metadata.MetadataObjectMapper.getMetadataPayload;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChannelPayload {
    private String id;
    private String source;
    private String sourceChannelId;

    private JsonNode metadata;

    public static ChannelPayload fromChannelContainer(ChannelContainer container) {
        final Channel channel = container.getChannel();
        return ChannelPayload.builder()
                .id(channel.getId())
                .metadata(getMetadataPayload(container.getMetadataMap()))
                .source(channel.getSource())
                .sourceChannelId(channel.getSourceChannelId())
                .build();
    }

    public static ChannelPayload fromChannel(Channel channel) {
        return ChannelPayload.builder()
                .id(channel.getId())
                .source(channel.getSource())
                .sourceChannelId(channel.getSourceChannelId())
                .build();
    }
}

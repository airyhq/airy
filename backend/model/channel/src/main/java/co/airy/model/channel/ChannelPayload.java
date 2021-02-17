package co.airy.model.channel;

import co.airy.avro.communication.Channel;
import co.airy.model.channel.dto.ChannelContainer;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.ObjectNode;
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
        if(container.getMetadataMap() == null) {
            return fromChannel(container.getChannel());
        }

        final Channel channel = container.getChannel();
        return ChannelPayload.builder()
                .id(channel.getId())
                .metadata(defaultMetadata(getMetadataPayload(container.getMetadataMap()), channel))
                .source(channel.getSource())
                .sourceChannelId(channel.getSourceChannelId())
                .build();
    }

    public static ChannelPayload fromChannel(Channel channel) {
        return ChannelPayload.builder()
                .id(channel.getId())
                .metadata(defaultMetadata(JsonNodeFactory.instance.objectNode(), channel))
                .source(channel.getSource())
                .sourceChannelId(channel.getSourceChannelId())
                .build();
    }

    private static JsonNode defaultMetadata(JsonNode metadata, Channel channel) {
        if (metadata.get("name") == null) {
            final String defaultName = String.format("%s %s", channel.getSource(), channel.getId().substring(31));
            ((ObjectNode) metadata).put("name", defaultName);
        }

        return metadata;
    }
}

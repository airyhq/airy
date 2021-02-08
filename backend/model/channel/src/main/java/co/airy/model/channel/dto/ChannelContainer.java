package co.airy.model.channel.dto;

import co.airy.avro.communication.Channel;
import co.airy.model.metadata.dto.MetadataMap;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.List;

import static co.airy.model.metadata.MetadataRepository.newChannelMetadata;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChannelContainer implements Serializable {
    private Channel channel;
    private MetadataMap metadataMap;

    public MetadataMap getMetadataMap() {
        return this.metadataMap != null ? this.metadataMap : getDefaultMetadata();
    }

    private MetadataMap getDefaultMetadata() {
        final String defaultName = String.format("%s %s", channel.getSource(), channel.getId().substring(31));
        return MetadataMap.from(List.of(
                newChannelMetadata(channel.getId(), "name", defaultName)
        ));
    }
}

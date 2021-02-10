package co.airy.model.channel.dto;

import co.airy.avro.communication.Channel;
import co.airy.model.metadata.MetadataKeys;
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
}

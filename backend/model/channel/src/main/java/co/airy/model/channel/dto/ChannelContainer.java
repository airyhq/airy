package co.airy.model.channel.dto;

import co.airy.avro.communication.Channel;
import co.airy.model.metadata.dto.MetadataMap;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChannelContainer implements Serializable {
    private Channel channel;
    @Builder.Default
    private MetadataMap metadataMap = new MetadataMap();
}

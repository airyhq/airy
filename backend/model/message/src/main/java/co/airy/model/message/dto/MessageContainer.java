package co.airy.model.message.dto;

import co.airy.avro.communication.Message;
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
public class MessageContainer implements Serializable {
    private Message message;
    @Builder.Default
    private MetadataMap metadataMap = new MetadataMap();
}

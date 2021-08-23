package co.airy.model.message.dto;

import co.airy.avro.communication.Message;
import co.airy.model.metadata.dto.MetadataMap;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.Optional;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MessageContainer implements Serializable {
    private Message message;
    @Builder.Default
    private MetadataMap metadataMap = new MetadataMap();

    public long getUpdatedAt() {
        return Math.max(Optional.ofNullable(message.getUpdatedAt()).orElse(message.getSentAt()),
                Optional.ofNullable(metadataMap).map(MetadataMap::getUpdatedAt).orElse(0L));
    }
}

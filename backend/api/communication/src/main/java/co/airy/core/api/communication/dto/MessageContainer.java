package co.airy.core.api.communication.dto;

import co.airy.avro.communication.Message;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MessageContainer implements Serializable {
    private Message message;
    private Map<String, String> metadataMap;
}

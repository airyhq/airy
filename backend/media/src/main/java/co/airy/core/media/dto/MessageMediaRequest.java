package co.airy.core.media.dto;

import co.airy.avro.communication.Message;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MessageMediaRequest implements Serializable {
    private Message message;
    private Map<String, String> metadata;
}

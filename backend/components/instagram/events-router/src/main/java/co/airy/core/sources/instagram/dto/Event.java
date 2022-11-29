package co.airy.core.sources.instagram.dto;

import co.airy.avro.communication.Channel;
import co.airy.uuid.UUIDv5;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder(toBuilder = true)
public class Event implements Serializable {
    private String sourceConversationId;
    private String payload;
    private Channel channel;

    @JsonIgnore
    public String getConversationId() {
        return UUIDv5.fromNamespaceAndName(channel.getId(), sourceConversationId).toString();
    }
}

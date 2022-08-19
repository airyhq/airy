package co.airy.core.sources.whatsapp.dto;

import co.airy.avro.communication.Channel;
import co.airy.core.sources.whatsapp.model.WebhookEntry;
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
    private WebhookEntry.Change payload;
    private Channel channel;
}

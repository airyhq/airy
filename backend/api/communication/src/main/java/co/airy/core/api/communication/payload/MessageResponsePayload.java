package co.airy.core.api.communication.payload;

import co.airy.avro.communication.SenderType;
import co.airy.mapping.model.Content;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MessageResponsePayload {
    private String id;
    private Content content;
    private String senderType;
    private String sentAt;
    private String deliveryState;
}

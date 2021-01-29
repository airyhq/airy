package co.airy.core.api.communication.payload;

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
    private String content;
    private String senderType;
    private String sentAt;
    private String deliveryState;
}

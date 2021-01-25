package co.airy.core.api.communication.payload;

import co.airy.mapping.model.Content;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

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

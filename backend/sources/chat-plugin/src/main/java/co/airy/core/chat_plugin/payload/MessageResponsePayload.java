package co.airy.core.chat_plugin.payload;

import co.airy.mapping.model.Content;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MessageResponsePayload implements Serializable {
    private String id;
    private Content content;
    private String state;
    private String senderType;
    private String sentAt;
    private String deliveryState;
}

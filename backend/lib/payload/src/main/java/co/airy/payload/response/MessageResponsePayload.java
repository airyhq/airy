package co.airy.payload.response;

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
    public String id;
    public String content;
    public String state;
    public String alignment;
    public String sentAt;
    public String deliveryState;
}

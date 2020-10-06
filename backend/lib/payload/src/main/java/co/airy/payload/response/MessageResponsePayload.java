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
    private String id;
    private String content;
    private String state;
    private String alignment;
    private String sentAt;
}

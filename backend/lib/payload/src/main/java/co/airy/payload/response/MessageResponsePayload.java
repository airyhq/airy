package co.airy.payload.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class MessageResponsePayload implements Serializable {
    public String id;
    public String text;
    public String metadata;
    public long offset;
    public ContactResponsePayload sender;
    public String alignment;
    public String sentAt;
}

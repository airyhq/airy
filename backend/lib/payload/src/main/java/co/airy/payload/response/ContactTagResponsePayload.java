package backend.lib.payload.src.main.java.co.airy.payload.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class ContactTagResponsePayload implements Serializable {
    public String id;
    public String name;
    public String color;
}

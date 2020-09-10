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
public class AttachmentPayload implements Serializable {

    public String type;

    public String url;

    public String title;

    public AttachmentPayloadPayload payload;
}

package co.airy.core.api.send_message;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;
import java.io.Serializable;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SendMessageRequestPayload {

    @NotBlank
    public String conversationId;

    @JsonProperty("text")
    public String text;

    //forgot to delete?
    @JsonProperty("metadata")
    public String metadata;
}

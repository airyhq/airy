package co.airy.core.api.conversations.payload;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SendMessageRequestPayload {

    @NotBlank
    public String conversationId;

    @JsonProperty("text")
    public String text;
}

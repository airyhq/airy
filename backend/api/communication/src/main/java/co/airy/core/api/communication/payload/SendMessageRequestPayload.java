package co.airy.core.api.communication.payload;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;

import javax.validation.constraints.NotBlank;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SendMessageRequestPayload {
    @NotBlank
    private String conversationId;
    @NonNull
    private MessagePayload message;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MessagePayload {
        @JsonProperty("text")
        private String text;
    }
}

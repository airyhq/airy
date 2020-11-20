package co.airy.core.chat_plugin.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Data
@NoArgsConstructor
public class SendMessageRequestPayload {
    @NotNull
    private MessagePayload message;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MessagePayload {
        @NotBlank
        private String text;
    }
}

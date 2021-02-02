package co.airy.core.chat_plugin.payload;

import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotNull;

@Data
@NoArgsConstructor
public class SendMessageRequestPayload {
    @NotNull
    private TextMessage message;

    @Data
    @NoArgsConstructor
    public static class TextMessage {
        @NotNull
        private String text;
    }
}

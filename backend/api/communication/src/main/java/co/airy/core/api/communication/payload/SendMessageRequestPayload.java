package co.airy.core.api.communication.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;

import javax.validation.Valid;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SendMessageRequestPayload {
    @NonNull
    private UUID conversationId;
    @Valid
    @NonNull
    private MessagePayload message;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MessagePayload {
        private String text;
    }
}

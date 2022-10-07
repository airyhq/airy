package co.airy.core.communication.payload;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import java.util.Map;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MessageSuggestRepliesRequestPayload {
    @NotNull
    private UUID messageId;

    @Valid
    private Map<String, Suggestion> suggestions;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Suggestion {
        private JsonNode content;
    }
}

package co.airy.core.sources.instagram.api.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.JsonNode;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class SendMessagePayload {
    private String messagingType;
    private MessageRecipient recipient;
    private JsonNode message;
    private String tag;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MessageRecipient {
        private String id;
    }
}

package co.airy.core.sources.facebook.api.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.JsonNode;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class SendMessagePayload {
    private String messagingType;
    private MessageRecipient recipient;
    private MessagePayload message;
    private String tag;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MessageRecipient {
        private String id;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MessagePayload implements Serializable {
        private String text;
        private AttachmentPayload attachment;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AttachmentPayload implements Serializable {
        private String type;
        private JsonNode payload;
    }
}

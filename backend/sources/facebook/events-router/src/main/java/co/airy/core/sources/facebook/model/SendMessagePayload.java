package co.airy.core.sources.facebook.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class SendMessagePayload {

    @JsonProperty("messaging_type")
    private String messagingType;

    @JsonProperty("recipient")
    private MessageRecipient recipient;

    @JsonProperty("message")
    private MessagePayload message;

    @JsonProperty("tag")
    private String tag;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    public static class MessageRecipient {

        @JsonProperty("id")
        private String id;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    public static class MessagePayload implements Serializable {
        @JsonProperty("text")
        public String text;
    }
}

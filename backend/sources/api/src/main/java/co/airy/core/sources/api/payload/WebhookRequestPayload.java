package co.airy.core.sources.api.payload;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.Data;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import java.util.List;

import static co.airy.date.format.DateFormat.instantFromIso;

@Data
public class WebhookRequestPayload {
    @Valid
    @NotNull
    private List<MessagePayload> messages = List.of();
    @Valid
    @NotNull
    private List<MetadataPayload> metadata = List.of();

    @Data
    public static class MessagePayload {
        @NotNull
        private String sourceMessageId;
        @NotNull
        private String sourceConversationId;
        @NotNull
        private String sourceChannelId;
        @NotNull
        private String sourceSenderId;
        @NotNull
        private JsonNode content;
        @NotNull
        private boolean fromContact;
        @NotNull
        private JsonNode sentAt;

        public long getSentAt() {
            if (sentAt.isNumber()) {
                return sentAt.longValue();
            }
            if (sentAt.isTextual()) {
                return instantFromIso(sentAt.textValue()).toEpochMilli();
            }
            throw new IllegalArgumentException("sentAt must be either a UNIX timestamp or an ISO8601 string.");
        }
    }

    @Data
    public static class MetadataPayload {
        @NotNull
        private String namespace;
        @NotNull
        private String sourceId;
        @NotNull
        private JsonNode metadata;
    }
}

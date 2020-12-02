package co.airy.core.sources.google;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Objects;
import java.util.stream.Stream;

@Data
@NoArgsConstructor
public class WebhookEvent {
    private String agent;

    private String conversationId;
    private String customAgentId;

    private JsonNode context;
    private JsonNode message;

    private JsonNode surveyResponse;
    private JsonNode suggestionResponse;
    private JsonNode receipts;
    private JsonNode userStatus;

    private String sendTime;

    public JsonNode getPayload() {
        return Stream.of(this.message, this.suggestionResponse, this.surveyResponse, this.receipts, this.userStatus)
                .filter(Objects::nonNull)
                .findFirst()
                .get();
    }

    public boolean isMessage() {
        return this.message != null;
    }
}

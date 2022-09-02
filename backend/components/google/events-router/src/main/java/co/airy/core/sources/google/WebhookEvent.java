package co.airy.core.sources.google;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.databind.JsonNode;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Objects;
import java.util.Optional;
import java.util.stream.Stream;

@Data
@NoArgsConstructor
@AllArgsConstructor
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

    @JsonIgnore
    public JsonNode getPayload() {
        return Stream.of(this.message, this.suggestionResponse, this.surveyResponse, this.receipts, this.userStatus)
                .filter(Objects::nonNull)
                .findFirst()
                .get();
    }

    @JsonIgnore
    public boolean hasMessage() {
        return this.message != null || this.surveyResponse != null || this.suggestionResponse != null || getLiveAgentRequest().isPresent();
    }

    @JsonIgnore
    public Optional<Boolean> getLiveAgentRequest() {
        return Optional.ofNullable(userStatus)
                .map((userStatus) -> userStatus.get("requestedLiveAgent"))
                .map(JsonNode::booleanValue);
    }

    @JsonIgnore
    public boolean hasContext() {
        return this.context != null && !this.context.isEmpty();
    }
}

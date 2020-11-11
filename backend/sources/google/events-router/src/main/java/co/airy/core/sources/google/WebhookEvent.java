package co.airy.core.sources.google;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.JsonNode;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Objects;
import java.util.stream.Stream;

@Data
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class WebhookEvent {
    private String agent;

    @JsonProperty("conversationId")
    private String conversationId;
    @JsonProperty("customAgentId")
    private String customAgentId;

    @JsonProperty("context")
    private JsonNode context;
    @JsonProperty("message")
    private JsonNode message;

    @JsonProperty("surveyResponse")
    private JsonNode surveyResponse;
    @JsonProperty("suggestionResponse")
    private JsonNode suggestionResponse;
    private JsonNode receipts;
    @JsonProperty("userStatus")
    private JsonNode userStatus;

    @JsonProperty("sendTime")
    private String sendTime;

    public JsonNode getPayload() {
        return Stream.of(this.message, this.suggestionResponse, this.surveyResponse, this.receipts, this.userStatus)
                .filter(Objects::nonNull)
                .findFirst()
                .get();
    }
}

package co.airy.core.sources.google;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.JsonNode;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class GooglePayload {
    @JsonProperty("requestId")
    private String requestId;

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

    @JsonProperty("userStatus")
    private JsonNode userStatus;

    @JsonProperty("sendTime")
    private String sendTime;

}

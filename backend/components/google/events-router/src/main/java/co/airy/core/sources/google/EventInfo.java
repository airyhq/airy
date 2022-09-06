package co.airy.core.sources.google;

import co.airy.avro.communication.Channel;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.databind.JsonNode;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder(toBuilder = true)
public class EventInfo implements Serializable {
    private String agentId;
    private String sourceConversationId;
    private WebhookEvent event;
    private Channel channel;
    private Long timestamp;
    private boolean isMessage;

    @JsonIgnore
    public Map<String, String> getMessageHeaders() {
        final Map<String, String> headers = new HashMap<>();

        final JsonNode suggestionResponse = event.getSuggestionResponse();
        if (suggestionResponse != null) {
            if (suggestionResponse.get("postbackData") != null) {
                headers.put("postback.payload", suggestionResponse.get("postbackData").textValue());
            } else {
                headers.put("postback.payload", "__empty__");
            }
        }

        return headers;
    }
}

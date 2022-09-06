package co.airy.core.sources.api.actions.payload;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.Data;

@Data
public class SendMessageResponsePayload {
    private String sourceMessageId;
    private JsonNode metadata;
}

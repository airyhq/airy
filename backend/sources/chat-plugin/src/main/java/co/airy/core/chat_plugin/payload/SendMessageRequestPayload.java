package co.airy.core.chat_plugin.payload;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotNull;

@Data
@NoArgsConstructor
public class SendMessageRequestPayload {
    private JsonNode message;
}

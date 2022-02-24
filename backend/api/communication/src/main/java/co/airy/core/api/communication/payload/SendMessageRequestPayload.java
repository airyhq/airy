package co.airy.core.api.communication.payload;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import java.time.Instant;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SendMessageRequestPayload {
    private UUID conversationId;
    private String sourceRecipientId;
    private UUID channelId;
    @Valid
    @NotNull
    private JsonNode message;
    private Instant timestamp = Instant.now();
}

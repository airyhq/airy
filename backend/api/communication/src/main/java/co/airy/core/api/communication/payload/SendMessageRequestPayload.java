package co.airy.core.api.communication.payload;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SendMessageRequestPayload {
    @NotNull
    private UUID conversationId;
    @Valid
    @NotNull
    private JsonNode message;
}

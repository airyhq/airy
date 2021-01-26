package co.airy.core.api.communication.payload;

import co.airy.mapping.model.Content;
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
    private Content message;
}

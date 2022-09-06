package co.airy.core.api.communication.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotNull;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MessageListRequestPayload {
    @NotNull
    private UUID conversationId;
    private String cursor;
    private Integer pageSize;
}

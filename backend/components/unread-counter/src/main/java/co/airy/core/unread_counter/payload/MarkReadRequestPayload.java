package co.airy.core.unread_counter.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotNull;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MarkReadRequestPayload {
    @NotNull
    private UUID conversationId;
}


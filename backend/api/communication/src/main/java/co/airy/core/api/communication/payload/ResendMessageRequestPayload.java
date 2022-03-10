package co.airy.core.api.communication.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResendMessageRequestPayload {
    @NonNull
    private UUID messageId;
}

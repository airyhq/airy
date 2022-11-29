package co.airy.core.sources.instagram.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotNull;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DisconnectChannelRequestPayload {
    @NotNull
    private UUID channelId;
}

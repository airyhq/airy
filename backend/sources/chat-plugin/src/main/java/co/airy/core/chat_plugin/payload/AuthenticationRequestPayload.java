package co.airy.core.chat_plugin.payload;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;

import java.util.UUID;

@Data
@NoArgsConstructor
public class AuthenticationRequestPayload {
    @NonNull
    private UUID channelId;
}


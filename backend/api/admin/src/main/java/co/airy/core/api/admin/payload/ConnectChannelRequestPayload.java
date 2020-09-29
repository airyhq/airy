package co.airy.core.api.admin.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ConnectChannelRequestPayload {
    @NonNull
    String source;
    @NonNull
    String sourceChannelId;
    @NonNull
    String token;
    String name;
    String imageUrl;
}

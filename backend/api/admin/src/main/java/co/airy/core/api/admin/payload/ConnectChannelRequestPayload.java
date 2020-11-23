package co.airy.core.api.admin.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotNull;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ConnectChannelRequestPayload {
    @NotNull
    String source;
    @NotNull
    String sourceChannelId;
    @NotNull
    String token;
    String name;
    String imageUrl;
}

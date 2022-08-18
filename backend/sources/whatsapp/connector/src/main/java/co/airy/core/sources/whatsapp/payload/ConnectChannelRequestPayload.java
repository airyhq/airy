package co.airy.core.sources.whatsapp.payload;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotNull;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ConnectChannelRequestPayload {
    @NotNull
    private String phoneNumberId;
    @NotNull
    private String userToken;
    @NotNull
    private String name;
    private String imageUrl;
}

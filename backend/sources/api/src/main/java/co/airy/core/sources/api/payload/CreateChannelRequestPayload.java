package co.airy.core.sources.api.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotNull;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateChannelRequestPayload {
    @NotNull
    private String name;
    @NotNull
    private String sourceChannelId;
    private String imageUrl;
}

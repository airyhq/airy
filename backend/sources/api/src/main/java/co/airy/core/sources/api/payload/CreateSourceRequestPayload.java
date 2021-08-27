package co.airy.core.sources.api.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotNull;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateSourceRequestPayload {
    @NotNull
    private String sourceId;
    private String name;
    private String imageUrl;
    private String actionEndpoint;
}

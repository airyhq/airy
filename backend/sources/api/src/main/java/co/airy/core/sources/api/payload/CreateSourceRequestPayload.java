package co.airy.core.sources.api.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotNull;
import java.net.URL;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateSourceRequestPayload {
    @NotNull
    private String sourceId;
    private String name;
    private String imageUrl;
    private URL actionEndpoint;
}

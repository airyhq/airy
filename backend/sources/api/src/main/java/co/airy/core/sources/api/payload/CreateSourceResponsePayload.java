package co.airy.core.sources.api.payload;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CreateSourceResponsePayload {
    private String sourceId;
    private String actionEndpoint;
    private String token;
}

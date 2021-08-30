package co.airy.core.sources.api.payload;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SourceResponsePayload {
    private String sourceId;
    private String token;
    private String actionEndpoint;
    private String name;
    private String imageUrl;
}

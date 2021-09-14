package co.airy.core.sources.api.payload;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class ListSourceResponsePayload {
    private List<SourceResponsePayload> data;
}

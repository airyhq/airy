package co.airy.core.sources.facebook.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExploreResponsePayload {
    private List<PageInfoResponsePayload> data;
}


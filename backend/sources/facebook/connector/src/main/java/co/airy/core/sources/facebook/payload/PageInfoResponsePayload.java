package co.airy.core.sources.facebook.payload;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PageInfoResponsePayload {
    private String pageId;
    private String name;
    private String imageUrl;
    private boolean connected;
}

package co.airy.core.sources.facebook;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FacebookMetadata {
    private String sourceChannelId;
    private String name;
    private String imageUrl;
}

package co.airy.core.sources.facebook.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChannelData {
    private String sourceChannelId;
    private String name;
    private String imageUrl;
    private boolean connected;
}

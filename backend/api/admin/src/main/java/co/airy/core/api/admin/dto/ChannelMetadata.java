package co.airy.core.api.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChannelMetadata {
    private String sourceChannelId;
    private String name;
    private String imageUrl;
}

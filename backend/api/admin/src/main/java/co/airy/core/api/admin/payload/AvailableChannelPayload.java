package co.airy.core.api.admin.payload;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AvailableChannelPayload {

    private String sourceChannelId;

    private String name;

    private String imageUrl;

    private boolean connected;

}

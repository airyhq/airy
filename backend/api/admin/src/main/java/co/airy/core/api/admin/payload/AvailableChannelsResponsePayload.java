package co.airy.core.api.admin.payload;

import co.airy.payload.response.ChannelPayload;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AvailableChannelsResponsePayload {
    private List<AvailableChannelPayload> data;
}

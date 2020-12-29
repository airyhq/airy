package co.airy.core.api.admin.payload;

import co.airy.model.channel.ChannelPayload;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChannelsResponsePayload {
    private List<ChannelPayload> data;
}

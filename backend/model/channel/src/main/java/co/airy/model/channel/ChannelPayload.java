package co.airy.model.channel;

import co.airy.avro.communication.Channel;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import static com.fasterxml.jackson.annotation.JsonInclude.Include.NON_NULL;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class ChannelPayload {
    private String id;

    @JsonInclude(NON_NULL)
    private String name;

    @JsonInclude(NON_NULL)
    private String source;

    @JsonInclude(NON_NULL)
    private String sourceChannelId;

    @JsonInclude(NON_NULL)
    private String imageUrl;

    public static ChannelPayload fromChannel(Channel channel) {
        return ChannelPayload.builder()
                .name(channel.getName())
                .id(channel.getId())
                .imageUrl(channel.getImageUrl())
                .source(channel.getSource())
                .sourceChannelId(channel.getSourceChannelId())
                .build();
    }
}
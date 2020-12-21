package co.airy.core.api.admin;

import co.airy.avro.communication.Channel;
import co.airy.core.api.admin.payload.ChannelsResponsePayload;
import co.airy.payload.response.ChannelPayload;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import static java.util.stream.Collectors.toList;

@RestController
public class ChannelsController {
    private final Stores stores;

    public ChannelsController(Stores stores) {
        this.stores = stores;
    }

    @PostMapping("/channels.list")
    ResponseEntity<ChannelsResponsePayload> listChannels() {
        final List<Channel> channels = stores.getChannels();

        return ResponseEntity.ok(new ChannelsResponsePayload(channels.stream().map(this::fromChannel).collect(toList())));
    }

    public ChannelPayload fromChannel(Channel channel) {
        return ChannelPayload.builder()
                .name(channel.getName())
                .id(channel.getId())
                .imageUrl(channel.getImageUrl())
                .source(channel.getSource())
                .sourceChannelId(channel.getSourceChannelId())
                .build();
    }

}

package co.airy.core.api.admin;

import co.airy.avro.communication.Channel;
import co.airy.channel.ChannelPayload;
import co.airy.core.api.admin.payload.ChannelsResponsePayload;
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

        return ResponseEntity.ok(new ChannelsResponsePayload(channels.stream()
                .map(ChannelPayload::fromChannel)
                .collect(toList())));
    }

}

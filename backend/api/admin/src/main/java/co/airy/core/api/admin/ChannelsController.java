package co.airy.core.api.admin;

import co.airy.avro.communication.Channel;
import co.airy.avro.communication.ChannelConnectionState;
import co.airy.core.api.admin.payload.AvailableChannelPayload;
import co.airy.core.api.admin.payload.AvailableChannelsRequestPayload;
import co.airy.core.api.admin.payload.AvailableChannelsResponsePayload;
import co.airy.core.api.admin.payload.ChannelsResponsePayload;
import co.airy.payload.response.RequestError;
import lombok.NonNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static java.util.stream.Collectors.toList;

@RestController
public class ChannelsController {

    @Autowired
    Stores stores;

    @Autowired
    SourceMapConfig.SourceMap sourceMap;

    @PostMapping("/channels.connected")
    ResponseEntity<ChannelsResponsePayload> connectedChannels() {
        final Map<String, Channel> channelsMap = stores.getChannelsMap();

        return ResponseEntity.ok(
                new ChannelsResponsePayload(
                        channelsMap.values()
                                .stream()
                                .filter((channel -> ChannelConnectionState.CONNECTED.equals(channel.getConnectionState())))
                                .map(Mapper::fromChannel)
                                .collect(toList())
                )
        );
    }

    @PostMapping("/channels.available")
    ResponseEntity availableChannels(@RequestBody @Valid AvailableChannelsRequestPayload requestPayload) throws SourceApiException {
        final String sourceIdentifier = requestPayload.getSource();

        final Source source = sourceMap.get(sourceIdentifier);

        if (source == null) {
            return ResponseEntity.badRequest().body(new RequestError(String.format("source %s not implemented", source)));
        }

        final List<AvailableChannelPayload> availableChannels = source.getAvailableChannels(requestPayload.getToken());

        final Map<String, Channel> channelsMap = stores.getChannelsMap();
        final List<String> connectedSourceIds = channelsMap.values()
                .stream()
                .filter((channel -> ChannelConnectionState.CONNECTED.equals(channel.getConnectionState())))
                .map(Channel::getSourceChannelId)
                .collect(toList());

        return ResponseEntity.ok(
                new AvailableChannelsResponsePayload(
                        availableChannels.stream()
                                .peek((channel) -> channel.setConnected(connectedSourceIds.contains(channel.getSourceChannelId())))
                                .collect(toList())
                )
        );
    }
}

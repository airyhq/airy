package co.airy.core.api.admin;

import co.airy.avro.communication.Channel;
import co.airy.avro.communication.ChannelConnectionState;
import co.airy.core.api.admin.dto.ChannelMetadata;
import co.airy.core.api.admin.payload.AvailableChannelPayload;
import co.airy.core.api.admin.payload.AvailableChannelsRequestPayload;
import co.airy.core.api.admin.payload.AvailableChannelsResponsePayload;
import co.airy.core.api.admin.payload.ChannelsResponsePayload;
import co.airy.core.api.admin.payload.ConnectChannelRequestPayload;
import co.airy.core.api.admin.payload.DisconnectChannelRequestPayload;
import co.airy.payload.response.EmptyResponsePayload;
import co.airy.payload.response.RequestError;
import co.airy.uuid.UUIDV5;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static java.util.stream.Collectors.toList;

@RestController
public class ChannelsController {

    @Autowired
    Stores stores;

    @Autowired
    List<Source> sources;

    private Source getSource(String sourceIdentifier) {
        return Optional.ofNullable(sources)
                .orElse(List.of())
                .stream()
                .filter((source -> source.getIdentifier().equalsIgnoreCase(sourceIdentifier)))
                .findFirst()
                .orElse(null);
    }

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
    ResponseEntity<?> availableChannels(@RequestBody @Valid AvailableChannelsRequestPayload requestPayload) {
        final String sourceIdentifier = requestPayload.getSource();

        final Source source = getSource(sourceIdentifier);

        if (source == null) {
            return ResponseEntity.badRequest().body(new RequestError(String.format("source %s not implemented", source)));
        }

        final List<ChannelMetadata> availableChannels;

        try {
            availableChannels = source.getAvailableChannels(requestPayload.getToken());
        } catch (SourceApiException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new RequestError(e.getMessage()));
        }

        final Map<String, Channel> channelsMap = stores.getChannelsMap();
        final List<String> connectedSourceIds = channelsMap.values()
                .stream()
                .filter((channel -> ChannelConnectionState.CONNECTED.equals(channel.getConnectionState())))
                .map(Channel::getSourceChannelId)
                .collect(toList());

        return ResponseEntity.ok(
                new AvailableChannelsResponsePayload(
                        availableChannels.stream()
                                .map((channel) -> AvailableChannelPayload.builder()
                                        .sourceChannelId(channel.getSourceChannelId())
                                        .name(channel.getName())
                                        .imageUrl(channel.getImageUrl())
                                        .connected(connectedSourceIds.contains(channel.getSourceChannelId()))
                                        .build()
                                )
                                .collect(toList())
                )
        );
    }

    @PostMapping("/channels.connect")
    ResponseEntity<?> connectChannel(@RequestBody @Valid ConnectChannelRequestPayload requestPayload) {
        final String token = requestPayload.getToken();
        final String sourceChannelId = requestPayload.getSourceChannelId();
        final String sourceIdentifier = requestPayload.getSource();

        final String channelId = UUIDV5.fromNamespaceAndName(sourceIdentifier, sourceChannelId).toString();

        final Source source = getSource(sourceIdentifier);

        if (source == null) {
            return ResponseEntity.badRequest().body(new RequestError(String.format("source %s not implemented", source)));
        }

        final Map<String, Channel> channelsMap = stores.getChannelsMap();
        final Channel existingChannel = channelsMap.get(channelId);

        if (existingChannel != null && ChannelConnectionState.CONNECTED.equals(existingChannel.getConnectionState())) {
            return ResponseEntity.ok(Mapper.fromChannel(existingChannel));
        }

        final ChannelMetadata channelMetadata;

        try {
            channelMetadata = source.connectChannel(token, sourceChannelId);
        } catch (SourceApiException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new RequestError(e.getMessage()));
        }

        final Channel channel = Channel.newBuilder()
                .setId(channelId)
                .setConnectionState(ChannelConnectionState.CONNECTED)
                .setImageUrl(Optional.ofNullable(requestPayload.getImageUrl()).orElse(channelMetadata.getImageUrl()))
                .setName(Optional.ofNullable(requestPayload.getName()).orElse(channelMetadata.getName()))
                .setSource(sourceIdentifier)
                .setSourceChannelId(sourceChannelId)
                .setToken(token)
                .build();

        try {
            stores.storeChannel(channel);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).build();
        }

        return ResponseEntity.ok(Mapper.fromChannel(channel));
    }

    @PostMapping("/channels.disconnect")
    ResponseEntity<?> disconnectChannel(@RequestBody @Valid DisconnectChannelRequestPayload requestPayload) {
        final String channelId = requestPayload.getChannelId().toString();

        final Map<String, Channel> channelsMap = stores.getChannelsMap();
        final Channel channel = channelsMap.get(channelId);

        if (channel == null) {
            return ResponseEntity.notFound().build();
        } else if (channel.getConnectionState().equals(ChannelConnectionState.DISCONNECTED)) {
            return ResponseEntity.accepted().build();
        }

        final Source source = getSource(channel.getSource());

        if (source == null) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new RequestError(String.format("source %s not implemented", channel.getSource())));
        }

        try {
            source.disconnectChannel(channel.getToken(), channel.getSourceChannelId());
        } catch (SourceApiException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new RequestError(e.getMessage()));
        }

        channel.setConnectionState(ChannelConnectionState.DISCONNECTED);
        channel.setToken(null);

        return ResponseEntity.ok(new EmptyResponsePayload());
    }
}

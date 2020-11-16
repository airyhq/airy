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
import co.airy.payload.response.RequestErrorResponsePayload;
import co.airy.uuid.UUIDv5;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static java.util.stream.Collectors.toList;

@RestController
public class ChannelsController {

    private final Stores stores;

    private final Map<String, Source> sourceMap = new HashMap<>();

    public ChannelsController(Stores stores, List<Source> sources) {
        for (Source source : sources) {
            sourceMap.put(source.getIdentifier(), source);
        }
        this.stores = stores;
    }

    @PostMapping("/channels.list")
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

    @PostMapping("/channels.explore")
    ResponseEntity<?> listChannels(@RequestBody @Valid AvailableChannelsRequestPayload requestPayload) {
        final String sourceIdentifier = requestPayload.getSource();

        final Source source = sourceMap.get(sourceIdentifier);

        if (source == null) {
            return ResponseEntity.badRequest().body(new RequestErrorResponsePayload(String.format("source %s not implemented", sourceIdentifier)));
        }

        final List<ChannelMetadata> availableChannels;

        try {
            availableChannels = source.getAvailableChannels(requestPayload.getToken());
        } catch (SourceApiException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new RequestErrorResponsePayload(e.getMessage()));
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

        final String channelId = UUIDv5.fromNamespaceAndName(sourceIdentifier, sourceChannelId).toString();

        final Source source = sourceMap.get(sourceIdentifier);

        if (source == null) {
            return ResponseEntity.badRequest().body(new RequestErrorResponsePayload(String.format("source %s not implemented", source)));
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
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new RequestErrorResponsePayload(e.getMessage()));
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
        }

        if (channel.getConnectionState().equals(ChannelConnectionState.DISCONNECTED)) {
            return ResponseEntity.accepted().build();
        }

        final Source source = sourceMap.get(channel.getSource());

        if (source == null) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new RequestErrorResponsePayload(String.format("source %s not implemented", channel.getSource())));
        }

        try {
            source.disconnectChannel(channel.getToken(), channel.getSourceChannelId());
        } catch (SourceApiException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new RequestErrorResponsePayload(e.getMessage()));
        }

        channel.setConnectionState(ChannelConnectionState.DISCONNECTED);
        channel.setToken(null);

        try {
            stores.storeChannel(channel);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).build();
        }

        return ResponseEntity.ok(new EmptyResponsePayload());
    }
}

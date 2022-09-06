package co.airy.core.sources.api;

import co.airy.avro.communication.Channel;
import co.airy.avro.communication.ChannelConnectionState;
import co.airy.avro.communication.Metadata;
import co.airy.avro.communication.Source;
import co.airy.core.sources.api.payload.ChannelsResponsePayload;
import co.airy.core.sources.api.payload.CreateChannelRequestPayload;
import co.airy.core.sources.api.payload.DisconnectChannelRequestPayload;
import co.airy.core.sources.api.services.SourceToken;
import co.airy.model.channel.ChannelPayload;
import co.airy.model.channel.dto.ChannelContainer;
import co.airy.model.metadata.MetadataKeys;
import co.airy.model.metadata.Subject;
import co.airy.model.metadata.dto.MetadataMap;
import co.airy.uuid.UUIDv5;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import static co.airy.model.channel.ChannelPayload.fromChannelContainer;
import static co.airy.model.metadata.MetadataObjectMapper.getMetadataFromJson;
import static co.airy.model.metadata.MetadataRepository.newChannelMetadata;
import static java.util.stream.Collectors.toList;

@RestController
public class ChannelsController {
    private final Stores stores;
    private final SourceToken sourceToken;

    public ChannelsController(Stores stores, SourceToken sourceToken) {
        this.stores = stores;
        this.sourceToken = sourceToken;
    }

    @PostMapping("/sources.channels.create")
    ResponseEntity<?> createChannel(@RequestBody @Valid CreateChannelRequestPayload payload, Authentication authentication) throws Exception {
        final Source source = sourceToken.getSource(authentication);
        final String sourceChannelId = payload.getSourceChannelId();
        final String channelId = UUIDv5.fromNamespaceAndName(source.getId(), sourceChannelId).toString();

        List<Metadata> metadataList = new ArrayList<>();
        metadataList.add(newChannelMetadata(channelId, MetadataKeys.ChannelKeys.NAME, payload.getName()));

        if (payload.getMetadata() != null) {
            final Subject subject = new Subject("channel", channelId);
            final List<Metadata> fromJson = getMetadataFromJson(subject, payload.getMetadata());
            metadataList.addAll(fromJson);
        }

        final ChannelContainer container = ChannelContainer.builder()
                .channel(
                        Channel.newBuilder()
                                .setId(channelId)
                                .setConnectionState(ChannelConnectionState.CONNECTED)
                                .setSource(source.getId())
                                .setSourceChannelId(sourceChannelId)
                                .build()
                )
                .metadataMap(MetadataMap.from(metadataList)).build();
        try {
            stores.storeChannelContainer(container);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).build();
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(fromChannelContainer(container));
    }

    @PostMapping("/sources.channels.list")
    ResponseEntity<?> listChannels(Authentication authentication) {
        final Source source = sourceToken.getSource(authentication);
        final List<ChannelContainer> channels = stores.getAllChannels().stream()
                .filter((container -> source.getId().equals(container.getChannel().getSource())
                        && container.getChannel().getConnectionState().equals(ChannelConnectionState.CONNECTED)))
                .collect(Collectors.toList());
        return ResponseEntity.ok(new ChannelsResponsePayload(channels.stream()
                .map(ChannelPayload::fromChannelContainer)
                .collect(toList())));
    }

    @PostMapping("/sources.channels.disconnect")
    ResponseEntity<?> disconnectChannel(@RequestBody @Valid DisconnectChannelRequestPayload payload, Authentication authentication) {
        final Source source = sourceToken.getSource(authentication);
        final ChannelContainer container = stores.getChannel(payload.getChannelId().toString());
        if (container == null) {
            return ResponseEntity.notFound().build();
        }
        if (!container.getChannel().getSource().equals(source.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        final Channel channel = container.getChannel();
        if (channel.getConnectionState().equals(ChannelConnectionState.DISCONNECTED)) {
            return ResponseEntity.noContent().build();
        }

        channel.setConnectionState(ChannelConnectionState.DISCONNECTED);
        channel.setToken(null);

        try {
            stores.storeChannel(channel);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).build();
        }

        return ResponseEntity.noContent().build();
    }
}

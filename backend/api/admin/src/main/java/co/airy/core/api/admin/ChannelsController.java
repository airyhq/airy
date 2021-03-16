package co.airy.core.api.admin;

import co.airy.avro.communication.Channel;
import co.airy.avro.communication.Metadata;
import co.airy.avro.communication.ChannelConnectionState;
import co.airy.core.api.admin.payload.ChannelsResponsePayload;
import co.airy.model.channel.ChannelPayload;
import co.airy.model.channel.dto.ChannelContainer;
import co.airy.model.metadata.MetadataKeys;
import co.airy.model.metadata.dto.MetadataMap;
import co.airy.spring.web.payload.EmptyResponsePayload;
import co.airy.uuid.UUIDv5;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import java.util.List;
import java.util.ArrayList;
import java.util.UUID;

import static co.airy.model.channel.ChannelPayload.fromChannelContainer;
import static co.airy.model.metadata.MetadataRepository.newChannelMetadata;
import static java.util.stream.Collectors.toList;

@RestController
public class ChannelsController {
    private final Stores stores;

    public ChannelsController(Stores stores) {
        this.stores = stores;
    }

    @PostMapping("/channels.list")
    ResponseEntity<ChannelsResponsePayload> listChannels(@RequestBody @Valid ListChannelRequestPayload requestPayload) {
        final List<ChannelContainer> channels = stores.getChannels();
        final String sourceToFilter = requestPayload.getSource();
        return ResponseEntity.ok(new ChannelsResponsePayload(channels.stream()
                .filter((container) -> sourceToFilter == null || sourceToFilter.equals(container.getChannel().getSource()))
                .map(ChannelPayload::fromChannelContainer)
                .collect(toList())));
    }

    @PostMapping("/channels.info")
    ResponseEntity<?> getChannel(@RequestBody @Valid GetChannelRequestPayload requestPayload) {
        final ChannelContainer container = stores.getChannel(requestPayload.getChannelId().toString());
        if (container == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new EmptyResponsePayload());
        }

        return ResponseEntity.ok(fromChannelContainer(container));
    }

    @PostMapping("/channels.update")
    ResponseEntity<?> updateChannel(@RequestBody @Valid UpdateChannelRequestPayload requestPayload) {
        final String channelId = requestPayload.getChannelId().toString();
        final ChannelContainer container = stores.getChannel(channelId);
        if (container == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new EmptyResponsePayload());
        }

        final MetadataMap metadataMap = container.getMetadataMap();
        if (requestPayload.getName() != null) {
            metadataMap.put(MetadataKeys.ChannelKeys.NAME, newChannelMetadata(channelId, MetadataKeys.ChannelKeys.NAME, requestPayload.getName()));
        }
        if (requestPayload.getImageUrl() != null) {
            metadataMap.put(MetadataKeys.ChannelKeys.IMAGE_URL, newChannelMetadata(channelId, MetadataKeys.ChannelKeys.IMAGE_URL, requestPayload.getImageUrl()));
        }

        try {
            stores.storeMetadataMap(metadataMap);
            return ResponseEntity.ok(fromChannelContainer(container));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).build();
        }

    }

    @PostMapping("/channels.chatplugin.connect")
    ResponseEntity<?> connect(@RequestBody @Valid ConnectChannelRequestPayload requestPayload) {
        final String sourceChannelId = requestPayload.getName();
        final String sourceIdentifier = "chatplugin";

        final String channelId = UUIDv5.fromNamespaceAndName(sourceIdentifier, sourceChannelId).toString();

        List<Metadata> metadataList = new ArrayList<>();
        metadataList.add(newChannelMetadata(channelId, MetadataKeys.ChannelKeys.NAME, requestPayload.getName()));

        if (requestPayload.getImageUrl() != null) {
            metadataList.add(newChannelMetadata(channelId, MetadataKeys.ChannelKeys.IMAGE_URL, requestPayload.getImageUrl()));
        }

        final ChannelContainer container = ChannelContainer.builder()
                .channel(
                        Channel.newBuilder()
                                .setId(channelId)
                                .setConnectionState(ChannelConnectionState.CONNECTED)
                                .setSource(sourceIdentifier)
                                .setSourceChannelId(sourceChannelId)
                                .build()
                )
                .metadataMap(MetadataMap.from(metadataList)).build();

        try {
            stores.storeChannelContainer(container);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).build();
        }

        return ResponseEntity.ok(fromChannelContainer(container));
    }

    @PostMapping("/channels.chatplugin.disconnect")
    ResponseEntity<?> disconnect(@RequestBody @Valid ChannelDisconnectRequestPayload requestPayload) {
        final String channelId = requestPayload.getChannelId().toString();

        final ChannelContainer container = stores.getConnectedChannelsStore().get(channelId);

        if (container == null) {
            return ResponseEntity.notFound().build();
        }

        final Channel channel = container.getChannel();
        if (channel.getConnectionState().equals(ChannelConnectionState.DISCONNECTED)) {
            return ResponseEntity.accepted().body(new EmptyResponsePayload());
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

@Data
@NoArgsConstructor
class ListChannelRequestPayload {
    private String source;
}

@Data
@NoArgsConstructor
class GetChannelRequestPayload {
    @NotNull
    private UUID channelId;
}

@Data
@NoArgsConstructor
class UpdateChannelRequestPayload {
    @NotNull
    private UUID channelId;
    private String name;
    private String imageUrl;
}

@Data
@NoArgsConstructor
class ConnectChannelRequestPayload {
    @NotNull
    private String name;
    private String imageUrl;
}

@Data
@NoArgsConstructor
class ChannelDisconnectRequestPayload {
    @NotNull
    private UUID channelId;
}

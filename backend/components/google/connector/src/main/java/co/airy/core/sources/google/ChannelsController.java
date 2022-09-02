package co.airy.core.sources.google;

import co.airy.avro.communication.Channel;
import co.airy.avro.communication.ChannelConnectionState;
import co.airy.avro.communication.Metadata;
import co.airy.kafka.schema.application.ApplicationCommunicationChannels;
import co.airy.model.channel.dto.ChannelContainer;
import co.airy.model.metadata.MetadataKeys;
import co.airy.model.metadata.dto.MetadataMap;
import co.airy.uuid.UUIDv5;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import static co.airy.model.channel.ChannelPayload.fromChannelContainer;
import static co.airy.model.metadata.MetadataRepository.newChannelMetadata;

@RestController
public class ChannelsController {
    private static final String applicationCommunicationChannels = new ApplicationCommunicationChannels().name();
    private final Stores stores;

    public ChannelsController(Stores stores) {
        this.stores = stores;
    }

    @PostMapping("/channels.google.connect")
    ResponseEntity<?> connect(@RequestBody @Valid ConnectChannelRequestPayload payload) {
        final String gbmId = payload.getGbmId();
        final String sourceIdentifier = "google";

        final String channelId = UUIDv5.fromNamespaceAndName(sourceIdentifier, gbmId).toString();

        try {
            List<Metadata> metadataList = new ArrayList<>();
            metadataList.add(newChannelMetadata(channelId, MetadataKeys.ChannelKeys.NAME, payload.getName()));

            if (payload.getImageUrl() != null) {
                metadataList.add(newChannelMetadata(channelId, MetadataKeys.ChannelKeys.IMAGE_URL, payload.getImageUrl()));
            }

            final ChannelContainer container = ChannelContainer.builder()
                    .channel(
                            Channel.newBuilder()
                                    .setId(channelId)
                                    .setConnectionState(ChannelConnectionState.CONNECTED)
                                    .setSource(sourceIdentifier)
                                    .setSourceChannelId(gbmId)
                                    .build()
                    )
                    .metadataMap(MetadataMap.from(metadataList)).build();

            stores.storeChannelContainer(container);

            return ResponseEntity.ok(fromChannelContainer(container));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).build();
        }
    }

    @PostMapping("/channels.google.disconnect")
    ResponseEntity<?> disconnect(@RequestBody @Valid DisconnectChannelRequestPayload payload) {
        final String channelId = payload.getChannelId().toString();

        final Channel channel = stores.getChannelsStore().get(channelId);

        if (channel == null) {
            return ResponseEntity.notFound().build();
        }

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

@Data
@NoArgsConstructor
@AllArgsConstructor
class ConnectChannelRequestPayload {
    @NotNull
    private String gbmId;
    @NotNull
    private String name;
    private String imageUrl;
}

@Data
@NoArgsConstructor
@AllArgsConstructor
class DisconnectChannelRequestPayload {
    @NotNull
    private UUID channelId;
}

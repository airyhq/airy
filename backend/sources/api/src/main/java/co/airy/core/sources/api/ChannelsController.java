package co.airy.core.sources.api;

import co.airy.avro.communication.Channel;
import co.airy.avro.communication.ChannelConnectionState;
import co.airy.avro.communication.Metadata;
import co.airy.avro.communication.Source;
import co.airy.core.sources.api.payload.CreateChannelRequestPayload;
import co.airy.core.sources.api.services.SourceToken;
import co.airy.model.channel.dto.ChannelContainer;
import co.airy.model.metadata.MetadataKeys;
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

import static co.airy.model.channel.ChannelPayload.fromChannelContainer;
import static co.airy.model.metadata.MetadataRepository.newChannelMetadata;

@RestController
public class ChannelsController {
    private final Stores stores;
    private final SourceToken sourceToken;

    public ChannelsController(Stores stores, SourceToken sourceToken) {
        this.stores = stores;
        this.sourceToken = sourceToken;
    }

    @PostMapping("/sources.createChannel")
    ResponseEntity<?> createSourceChannel(@RequestBody @Valid CreateChannelRequestPayload payload, Authentication authentication) {
        final Source source = sourceToken.getSource(authentication);
        final String sourceChannelId = payload.getSourceChannelId();
        final String channelId = UUIDv5.fromNamespaceAndName(source.getId(), sourceChannelId).toString();

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
}

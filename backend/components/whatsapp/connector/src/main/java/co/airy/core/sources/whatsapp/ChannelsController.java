package co.airy.core.sources.whatsapp;

import co.airy.avro.communication.Channel;
import co.airy.avro.communication.ChannelConnectionState;
import co.airy.avro.communication.Metadata;
import co.airy.core.sources.whatsapp.api.Api;
import co.airy.core.sources.whatsapp.api.ApiException;
import co.airy.core.sources.whatsapp.payload.ConnectChannelRequestPayload;
import co.airy.core.sources.whatsapp.payload.DisconnectChannelRequestPayload;
import co.airy.model.channel.dto.ChannelContainer;
import co.airy.model.metadata.MetadataKeys;
import co.airy.model.metadata.dto.MetadataMap;
import co.airy.spring.web.payload.RequestErrorResponsePayload;
import co.airy.uuid.UUIDv5;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.util.List;

import static co.airy.model.channel.ChannelPayload.fromChannelContainer;
import static co.airy.model.metadata.MetadataRepository.newChannelMetadata;

@RestController
public class ChannelsController {

    private final Api api;
    private final Stores stores;

    public ChannelsController(Api api, Stores stores) {
        this.api = api;
        this.stores = stores;
    }

    @PostMapping("/channels.whatsapp.connect")
    ResponseEntity<?> connectWhatsapp(@RequestBody @Valid ConnectChannelRequestPayload payload) {
        final String token = payload.getUserToken();
        final String phoneNumber = payload.getPhoneNumberId();

        final String channelId = UUIDv5.fromNamespaceAndName("whatsapp", phoneNumber).toString();

        try {
            final String longLivingUserToken = api.exchangeToLongLivingUserAccessToken(token);

            final ChannelContainer container = ChannelContainer.builder()
                    .channel(
                            Channel.newBuilder()
                                    .setId(channelId)
                                    .setConnectionState(ChannelConnectionState.CONNECTED)
                                    .setSource("whatsapp")
                                    .setSourceChannelId(phoneNumber)
                                    .setToken(longLivingUserToken)
                                    .build()
                    )
                    .metadataMap(MetadataMap.from(List.of(
                            newChannelMetadata(channelId, MetadataKeys.ChannelKeys.NAME, payload.getName())
                    ))).build();

            if (payload.getImageUrl() != null) {
                final Metadata metadata = newChannelMetadata(channelId, MetadataKeys.ChannelKeys.IMAGE_URL, payload.getImageUrl());
                container.getMetadataMap().put(metadata.getKey(), metadata);
            }

            stores.storeChannelContainer(container);

            return ResponseEntity.ok(fromChannelContainer(container));
        } catch (ApiException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new RequestErrorResponsePayload(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).build();
        }
    }

    @PostMapping("/channels.whatsapp.disconnect")
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

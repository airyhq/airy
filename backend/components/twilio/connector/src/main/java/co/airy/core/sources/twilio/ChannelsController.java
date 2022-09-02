package co.airy.core.sources.twilio;

import co.airy.avro.communication.Channel;
import co.airy.avro.communication.ChannelConnectionState;
import co.airy.avro.communication.Metadata;
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
import java.util.Optional;
import java.util.UUID;

import static co.airy.model.channel.ChannelPayload.fromChannelContainer;
import static co.airy.model.metadata.MetadataRepository.newChannelMetadata;

@RestController
public class ChannelsController {
    private final Stores stores;

    public ChannelsController(Stores stores) {
        this.stores = stores;
    }

    @PostMapping("/channels.twilio.sms.connect")
    ResponseEntity<?> connectSms(@RequestBody @Valid ConnectChannelRequestPayload payload) {
        final String channelId = UUIDv5.fromNamespaceAndName("twilio.sms", payload.getPhoneNumber()).toString();

        final Channel channel = Channel.newBuilder()
                .setId(channelId)
                .setConnectionState(ChannelConnectionState.CONNECTED)
                .setSource("twilio.sms")
                .setSourceChannelId(payload.getPhoneNumber())
                .build();

        return connectChannel(channel, payload.getName(), payload.getImageUrl());
    }

    @PostMapping("/channels.twilio.whatsapp.connect")
    ResponseEntity<?> connectWhatsapp(@RequestBody @Valid ConnectChannelRequestPayload payload) {
        final String phoneNumber = "whatsapp:" + payload.getPhoneNumber();
        final String channelId = UUIDv5.fromNamespaceAndName("twilio.whatsapp", phoneNumber).toString();

        final Channel channel = Channel.newBuilder()
                .setId(channelId)
                .setConnectionState(ChannelConnectionState.CONNECTED)
                .setSource("twilio.whatsapp")
                .setSourceChannelId(phoneNumber)
                .build();

        return connectChannel(channel, payload.getName(), payload.getImageUrl());
    }

    private ResponseEntity<?> connectChannel(Channel channel, String name, String imageUrl) {
        try {
            List<Metadata> metadataList = new ArrayList<>();
            metadataList.add(newChannelMetadata(channel.getId(), MetadataKeys.ChannelKeys.NAME, name));

            if (imageUrl != null) {
                metadataList.add(newChannelMetadata(channel.getId(), MetadataKeys.ChannelKeys.IMAGE_URL, imageUrl));
            }

            final ChannelContainer container = ChannelContainer.builder()
                    .channel(channel)
                    .metadataMap(MetadataMap.from(metadataList)).build();

            stores.storeChannelContainer(container);
            return ResponseEntity.ok(fromChannelContainer(container));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).build();
        }
    }

    @PostMapping("/channels.twilio.sms.disconnect")
    ResponseEntity<?> disconnectSms(@RequestBody @Valid DisconnectChannelRequestPayload payload) {
        return disconnect(payload);
    }

    @PostMapping("/channels.twilio.whatsapp.disconnect")
    ResponseEntity<?> disconnectWhatsapp(@RequestBody @Valid DisconnectChannelRequestPayload payload) {
        return disconnect(payload);
    }

    private ResponseEntity<?> disconnect(@RequestBody @Valid DisconnectChannelRequestPayload payload) {
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
    private String phoneNumber;

    public String getPhoneNumber() {
        return Optional.ofNullable(phoneNumber)
                .map((phoneNumber) -> phoneNumber.replaceAll("\\s+","").trim())
                .orElse(null);
    }

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

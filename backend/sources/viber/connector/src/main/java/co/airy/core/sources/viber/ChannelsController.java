package co.airy.core.sources.viber;

import co.airy.avro.communication.Channel;
import co.airy.avro.communication.ChannelConnectionState;
import co.airy.avro.communication.Metadata;
import co.airy.core.sources.viber.dto.AccountInfo;
import co.airy.core.sources.viber.services.Api;
import co.airy.log.AiryLoggerFactory;
import co.airy.model.channel.dto.ChannelContainer;
import co.airy.model.metadata.MetadataKeys;
import co.airy.model.metadata.dto.MetadataMap;
import co.airy.spring.web.payload.RequestErrorResponsePayload;
import co.airy.uuid.UUIDv5;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static co.airy.model.channel.ChannelPayload.fromChannelContainer;
import static co.airy.model.metadata.MetadataRepository.newChannelMetadata;

@RestController
public class ChannelsController {
    private final static Logger log = AiryLoggerFactory.getLogger(ChannelsController.class);
    private final Stores stores;
    private final URL webhookUrl;
    private final Api api;
    private final AccountInfo accountInfo;

    public ChannelsController(Stores stores, @Value("${host}") String webhookUrl, @Value("${ngrok:#{null}}") String ngrok, Api api, AccountInfo accountInfo) {
        this.stores = stores;
        this.api = api;
        this.accountInfo = accountInfo;

        String configHost = Optional.ofNullable(ngrok).orElse(webhookUrl);
        try {
            this.webhookUrl = new URL(configHost + "/viber");
        } catch (MalformedURLException e) {
            log.error("Host from config was not a valid url {}", configHost, e);
            throw new RuntimeException(e);
        }

    }

    @PostMapping("/channels.viber.connect")
    ResponseEntity<?> connect(@RequestBody(required = false) @Valid ConnectChannelRequestPayload payload) {
        final String channelId = UUIDv5.fromName(accountInfo.getId()).toString();
        payload = payload != null ? payload : new ConnectChannelRequestPayload();

        try {
            api.setWebhook(webhookUrl.toString());

            List<Metadata> metadataList = new ArrayList<>();
            metadataList.add(newChannelMetadata(channelId, MetadataKeys.ChannelKeys.NAME,
                    Optional.ofNullable(payload.getName()).orElse(accountInfo.getName())));
            String avatarUrl = Optional.ofNullable(payload.getImageUrl()).orElse(accountInfo.getIcon());
            if (avatarUrl != null) {
                metadataList.add(newChannelMetadata(channelId, MetadataKeys.ChannelKeys.IMAGE_URL, avatarUrl));
            }

            final ChannelContainer container = ChannelContainer.builder()
                    .channel(
                            Channel.newBuilder()
                                    .setId(channelId)
                                    .setConnectionState(ChannelConnectionState.CONNECTED)
                                    .setSource("viber")
                                    .setSourceChannelId(accountInfo.getId())
                                    .build()
                    )
                    .metadataMap(MetadataMap.from(metadataList)).build();

            stores.storeChannelContainer(container);
            return ResponseEntity.ok(fromChannelContainer(container));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new RequestErrorResponsePayload("Failed to connect the viber webhook. Error: " + e));
        }
    }

    @PostMapping("/channels.viber.disconnect")
    ResponseEntity<?> disconnect(@RequestBody @Valid DisconnectChannelRequestPayload requestPayload) {
        final String channelId = requestPayload.getChannelId().toString();
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
            api.removeWebhook();
            stores.storeChannel(channel);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new RequestErrorResponsePayload("Failed to connect the viber webhook. Error: " + e));
        }

        return ResponseEntity.noContent().build();
    }
}

@Data
@NoArgsConstructor
@AllArgsConstructor
class ConnectChannelRequestPayload {
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

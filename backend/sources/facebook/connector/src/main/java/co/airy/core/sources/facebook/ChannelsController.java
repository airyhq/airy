package co.airy.core.sources.facebook;

import co.airy.avro.communication.Channel;
import co.airy.avro.communication.ChannelConnectionState;
import co.airy.avro.communication.Metadata;
import co.airy.core.sources.facebook.api.Api;
import co.airy.core.sources.facebook.api.ApiException;
import co.airy.core.sources.facebook.api.model.PageWithConnectInfo;
import co.airy.core.sources.facebook.payload.ConnectInstagramRequestPayload;
import co.airy.core.sources.facebook.payload.ConnectPageRequestPayload;
import co.airy.core.sources.facebook.payload.DisconnectChannelRequestPayload;
import co.airy.core.sources.facebook.payload.ExploreRequestPayload;
import co.airy.core.sources.facebook.payload.ExploreResponsePayload;
import co.airy.core.sources.facebook.payload.PageInfoResponsePayload;
import co.airy.model.channel.dto.ChannelContainer;
import co.airy.model.metadata.MetadataKeys;
import co.airy.model.metadata.dto.MetadataMap;
import co.airy.spring.web.payload.RequestErrorResponsePayload;
import co.airy.uuid.UUIDv5;
import org.apache.kafka.streams.state.KeyValueIterator;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static co.airy.model.channel.ChannelPayload.fromChannelContainer;
import static co.airy.model.metadata.MetadataRepository.newChannelMetadata;
import static java.util.stream.Collectors.toList;

@RestController
public class ChannelsController {

    private final Api api;
    private final Stores stores;

    public ChannelsController(Api api, Stores stores) {
        this.api = api;
        this.stores = stores;
    }

    @PostMapping("/channels.facebook.explore")
    ResponseEntity<?> explore(@RequestBody @Valid ExploreRequestPayload payload) {
        try {
            final List<PageWithConnectInfo> pagesInfo = api.getPagesInfo(payload.getAuthToken());

            final KeyValueIterator<String, Channel> iterator = stores.getChannelsStore().all();

            List<Channel> channels = new ArrayList<>();
            iterator.forEachRemaining(kv -> channels.add(kv.value));

            final List<String> connectedSourceIds = channels
                    .stream()
                    .filter((channel -> ChannelConnectionState.CONNECTED.equals(channel.getConnectionState())))
                    .map(Channel::getSourceChannelId)
                    .collect(toList());

            return ResponseEntity.ok(
                    new ExploreResponsePayload(
                            pagesInfo.stream()
                                    .map((page) -> PageInfoResponsePayload.builder()
                                            .pageId(page.getId())
                                            .name(page.getNameWithLocationDescriptor())
                                            .imageUrl(page.getPicture().getData().getUrl())
                                            .connected(connectedSourceIds.contains(page.getId()))
                                            .build()
                                    ).collect(toList())
                    )
            );
        } catch (ApiException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new RequestErrorResponsePayload(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).build();
        }
    }

    @PostMapping("/channels.facebook.connect")
    ResponseEntity<?> connectFacebook(@RequestBody @Valid ConnectPageRequestPayload payload) {
        final String token = payload.getPageToken();
        final String pageId = payload.getPageId();

        final String channelId = UUIDv5.fromNamespaceAndName("facebook", pageId).toString();

        try {
            final String longLivingUserToken = api.exchangeToLongLivingUserAccessToken(token);
            final PageWithConnectInfo fbPageWithConnectInfo = api.getPageForUser(pageId, longLivingUserToken);

            api.connectPageToApp(fbPageWithConnectInfo.getAccessToken());

            final ChannelContainer container = ChannelContainer.builder()
                    .channel(
                            Channel.newBuilder()
                                    .setId(channelId)
                                    .setConnectionState(ChannelConnectionState.CONNECTED)
                                    .setSource("facebook")
                                    .setSourceChannelId(pageId)
                                    .setToken(longLivingUserToken)
                                    .build()
                    )
                    .metadataMap(MetadataMap.from(List.of(
                            newChannelMetadata(channelId, MetadataKeys.ChannelKeys.NAME, Optional.ofNullable(payload.getName()).orElse(fbPageWithConnectInfo.getNameWithLocationDescriptor())),
                            newChannelMetadata(channelId, MetadataKeys.ChannelKeys.IMAGE_URL, Optional.ofNullable(payload.getImageUrl()).orElse(fbPageWithConnectInfo.getPicture().getData().getUrl()))
                    ))).build();

            stores.storeChannelContainer(container);

            return ResponseEntity.ok(fromChannelContainer(container));
        } catch (ApiException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new RequestErrorResponsePayload(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).build();
        }
    }

    @PostMapping("/channels.instagram.connect")
    ResponseEntity<?> connectInstagram(@RequestBody @Valid ConnectInstagramRequestPayload payload) {
        final String token = payload.getPageToken();
        final String pageId = payload.getPageId();
        final String accountId = payload.getAccountId();

        final String channelId = UUIDv5.fromNamespaceAndName("instagram", accountId).toString();

        try {
            final String longLivingUserToken = api.exchangeToLongLivingUserAccessToken(token);
            final PageWithConnectInfo fbPageWithConnectInfo = api.getPageForUser(pageId, longLivingUserToken);

            api.connectPageToApp(fbPageWithConnectInfo.getAccessToken());

            final MetadataMap metadataMap = MetadataMap.from(List.of(
                    newChannelMetadata(channelId, MetadataKeys.ChannelKeys.NAME, Optional.ofNullable(payload.getName()).orElse(String.format("%s Instagram account", fbPageWithConnectInfo.getNameWithLocationDescriptor())))
            ));

            Optional.ofNullable(payload.getImageUrl())
                    .ifPresent((imageUrl) -> {
                        final Metadata metadata = newChannelMetadata(channelId, MetadataKeys.ChannelKeys.IMAGE_URL, imageUrl);
                        metadataMap.put(metadata.getKey(), metadata);
                    });

            final ChannelContainer container = ChannelContainer.builder()
                    .channel(
                            Channel.newBuilder()
                                    .setId(channelId)
                                    .setConnectionState(ChannelConnectionState.CONNECTED)
                                    .setSource("instagram")
                                    .setSourceChannelId(accountId)
                                    .setToken(longLivingUserToken)
                                    .build()
                    )
                    .metadataMap(metadataMap).build();

            stores.storeChannelContainer(container);

            return ResponseEntity.ok(fromChannelContainer(container));
        } catch (ApiException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new RequestErrorResponsePayload(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).build();
        }
    }

    @PostMapping(path = {"/channels.facebook.disconnect", "/channels.instagram.disconnect"})
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

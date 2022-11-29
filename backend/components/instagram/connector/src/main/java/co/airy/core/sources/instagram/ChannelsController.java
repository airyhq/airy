package co.airy.core.sources.instagram;

import co.airy.core.sources.meta.api.Api;
import co.airy.core.sources.meta.api.ApiException;
import co.airy.core.sources.meta.api.model.FaceBookMetadataKeys;
import co.airy.core.sources.meta.api.model.PageWithConnectInfo;
import co.airy.core.sources.meta.payload.ConnectInstagramRequestPayload;
import co.airy.core.sources.meta.payload.ConnectPageRequestPayload;
import co.airy.core.sources.meta.payload.DisconnectChannelRequestPayload;
import co.airy.core.sources.meta.payload.ExploreRequestPayload;
import co.airy.core.sources.meta.payload.ExploreResponsePayload;
import co.airy.core.sources.meta.payload.PageInfoResponsePayload;

import co.airy.model.metadata.MetadataKeys;

public class ChannelsController {

    private final Api api;
    
    public ChannelsController(Api api) {
        this.api = api;
    }

    @PostMapping("/channels.facebook.explore")
    ResponseEntity<?> explore(@RequestBody @Valid ExploreRequestPayload payload) {
        try {
            final List<PageWithConnectInfo> pagesInfo = api.getPagesInfo(payload.getAuthToken());

            List<Channel> channels;
            try (KeyValueIterator<String, Channel> iterator = stores.getChannelsStore().all()) {
                channels = new ArrayList<>();
                iterator.forEachRemaining(kv -> channels.add(kv.value));
            }

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

    @PostMapping("/channels.instagram.connect")
    ResponseEntity<?> connectInstagram(@RequestBody @Valid ConnectInstagramRequestPayload payload) {
        final String token = payload.getPageToken();
        final String pageId = payload.getPageId();
        final String accountId = payload.getAccountId();

        final String channelId = UUIDv5.fromNamespaceAndName("instagram", accountId).toString();

        try {
            final String longLivingUserToken = api.exchangeToLongLivingUserAccessToken(token);
            final PageWithConnectInfo pageWithConnectInfo = api.getPageForUser(pageId, longLivingUserToken);

            api.connectPageToApp(pageWithConnectInfo.getAccessToken());

            final MetadataMap metadataMap = MetadataMap.from(List.of(
                    newChannelMetadata(channelId, MetadataKeys.ChannelKeys.NAME, Optional.ofNullable(payload.getName()).orElse(String.format("%s Instagram account", pageWithConnectInfo.getNameWithLocationDescriptor()))),
                    newChannelMetadata(channelId, FaceBookMetadataKeys.ChannelKeys.PAGE_ID, payload.getPageId()),
                    newChannelMetadata(channelId, FaceBookMetadataKeys.ChannelKeys.PAGE_TOKEN, payload.getPageToken()),
                    newChannelMetadata(channelId, FaceBookMetadataKeys.ChannelKeys.ACCOUNT_ID, payload.getAccountId())
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

    @PostMapping("/channels.instagram.disconnect")
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

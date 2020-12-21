package co.airy.core.sources.facebook;

import co.airy.avro.communication.Channel;
import co.airy.avro.communication.ChannelConnectionState;
import co.airy.core.sources.facebook.dto.ChannelData;
import co.airy.core.sources.facebook.dto.ConnectRequestPayload;
import co.airy.core.sources.facebook.dto.ExploreRequestPayload;
import co.airy.core.sources.facebook.dto.ExploreResponsePayload;
import co.airy.core.sources.facebook.dto.FacebookMetadata;
import co.airy.core.sources.facebook.services.Api;
import co.airy.core.sources.facebook.services.PageWithConnectInfo;
import co.airy.payload.response.ChannelPayload;
import co.airy.payload.response.RequestErrorResponsePayload;
import co.airy.uuid.UUIDv5;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import javax.validation.Valid;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static java.util.stream.Collectors.toList;

public class ChannelsController {

    private final Api api;
    private final Stores stores;

    public ChannelsController(Api api, Stores stores) {
        this.api = api;
        this.stores = stores;
    }

    @PostMapping("/facebook.explore")
    ResponseEntity<?> explore(@RequestBody @Valid ExploreRequestPayload requestPayload) {
        List<FacebookMetadata> availableChannels;
        try {
            availableChannels = getAvailableChannels(requestPayload.getPageToken());
        } catch (ApiException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new RequestErrorResponsePayload(e.getMessage()));
        }

        final Map<String, Channel> channelsMap = stores.getChannelsMap();
        final List<String> connectedSourceIds = channelsMap.values()
                .stream()
                .filter((channel -> ChannelConnectionState.CONNECTED.equals(channel.getConnectionState())))
                .map(Channel::getSourceChannelId)
                .collect(toList());

        return ResponseEntity.ok(
                new ExploreResponsePayload(
                        availableChannels.stream()
                                .map((channel) -> ChannelData.builder()
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

    @PostMapping("/facebook.connect")
    ResponseEntity<?> connect(@RequestBody @Valid ConnectRequestPayload requestPayload) {
        final String token = requestPayload.getToken();
        final String sourceChannelId = requestPayload.getSourceChannelId();

        final String channelId = UUIDv5.fromNamespaceAndName("facebook", sourceChannelId).toString();
        final Map<String, Channel> channelsMap = stores.getChannelsMap();
        final Channel existingChannel = channelsMap.get(channelId);

        if (existingChannel != null && ChannelConnectionState.CONNECTED.equals(existingChannel.getConnectionState())) {
            return ResponseEntity.ok(fromChannel(existingChannel));
        }

        final FacebookMetadata facebookMetadata = connectChannel(token, sourceChannelId);

        final Channel channel = Channel.newBuilder()
                .setId(channelId)
                .setConnectionState(ChannelConnectionState.CONNECTED)
                .setImageUrl(Optional.ofNullable(requestPayload.getImageUrl()).orElse(facebookMetadata.getImageUrl()))
                .setName(Optional.ofNullable(requestPayload.getName()).orElse(facebookMetadata.getName()))
                .setSource("facebook")
                .setSourceChannelId(sourceChannelId)
                .setToken(token)
                .build();

        try {
            stores.storeChannel(channel);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).build();
        }

        return ResponseEntity.ok(fromChannel(channel));
    }

    private List<FacebookMetadata> getAvailableChannels(String token) throws ApiException {
        try {
            final List<PageWithConnectInfo> allPagesForUser = api.getAllPagesForUser(token);

            return allPagesForUser.stream()
                    .map((page) -> FacebookMetadata.builder()
                            .sourceChannelId(page.getId())
                            .name(page.getNameWithLocationDescriptor())
                            .imageUrl(page.getPicture().getData().getUrl())
                            .build()
                    ).collect(toList());
        } catch (Exception e) {
            throw new ApiException(e.getMessage());
        }
    }

    private FacebookMetadata connectChannel(String token, String sourceChannelId) throws ApiException {
        try {
            final String longLivingUserToken = api.exchangeToLongLivingUserAccessToken(token);
            final PageWithConnectInfo fbPageWithConnectInfo = api.getPageForUser(sourceChannelId, longLivingUserToken);

            api.connectPageToApp(fbPageWithConnectInfo.getAccessToken());

            return FacebookMetadata.builder()
                    .name(fbPageWithConnectInfo.getNameWithLocationDescriptor())
                    .sourceChannelId(fbPageWithConnectInfo.getId())
                    .imageUrl(fbPageWithConnectInfo.getPicture().getData().getUrl())
                    .build();
        } catch (Exception e) {
            throw new ApiException(e.getMessage());
        }
    }

    private ChannelPayload fromChannel(Channel channel) {
        return ChannelPayload.builder()
                .name(channel.getName())
                .id(channel.getId())
                .imageUrl(channel.getImageUrl())
                .source(channel.getSource())
                .sourceChannelId(channel.getSourceChannelId())
                .build();
    }

}

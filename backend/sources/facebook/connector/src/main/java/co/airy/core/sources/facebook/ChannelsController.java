package co.airy.core.sources.facebook;

import co.airy.avro.communication.Channel;
import co.airy.avro.communication.ChannelConnectionState;
import co.airy.core.sources.facebook.dto.ChannelData;
import co.airy.core.sources.facebook.dto.ExploreRequestPayload;
import co.airy.core.sources.facebook.dto.ExploreResponsePayload;
import co.airy.core.sources.facebook.services.Api;
import co.airy.core.sources.facebook.services.PageWithConnectInfo;
import co.airy.payload.response.RequestErrorResponsePayload;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import javax.validation.Valid;
import java.util.List;
import java.util.Map;

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

    public List<FacebookMetadata> getAvailableChannels(String token) throws ApiException {
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

    public FacebookMetadata connectChannel(String token, String sourceChannelId) throws ApiException {
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

}

package co.airy.core.sources.facebook;

import co.airy.avro.communication.Channel;
import co.airy.avro.communication.ChannelConnectionState;
import co.airy.core.sources.facebook.payload.PageInfoResponsePayload;
import co.airy.core.sources.facebook.payload.ConnectRequestPayload;
import co.airy.core.sources.facebook.payload.ExploreRequestPayload;
import co.airy.core.sources.facebook.payload.ExploreResponsePayload;
import co.airy.core.sources.facebook.api.Api;
import co.airy.core.sources.facebook.api.ApiException;
import co.airy.core.sources.facebook.api.model.PageWithConnectInfo;
import co.airy.payload.response.RequestErrorResponsePayload;
import co.airy.uuid.UUIDv5;
import org.apache.kafka.streams.state.KeyValueIterator;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import javax.validation.Valid;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static co.airy.model.channel.ChannelPayload.fromChannel;
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
        try {
            final List<PageWithConnectInfo> pagesInfo = api.getPagesInfo(requestPayload.getAuthToken());

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

    @PostMapping("/facebook.connect")
    ResponseEntity<?> connect(@RequestBody @Valid ConnectRequestPayload requestPayload) {
        final String token = requestPayload.getPageToken();
        final String pageId = requestPayload.getPageId();

        final String channelId = UUIDv5.fromNamespaceAndName("facebook", pageId).toString();

        try {
            final String longLivingUserToken = api.exchangeToLongLivingUserAccessToken(token);
            final PageWithConnectInfo fbPageWithConnectInfo = api.getPageForUser(pageId, longLivingUserToken);

            api.connectPageToApp(fbPageWithConnectInfo.getAccessToken());

            final Channel channel = Channel.newBuilder()
                    .setId(channelId)
                    .setConnectionState(ChannelConnectionState.CONNECTED)
                    .setImageUrl(Optional.ofNullable(requestPayload.getImageUrl()).orElse(fbPageWithConnectInfo.getPicture().getData().getUrl()))
                    .setName(Optional.ofNullable(requestPayload.getName()).orElse(fbPageWithConnectInfo.getNameWithLocationDescriptor()))
                    .setSource("facebook")
                    .setSourceChannelId(pageId)
                    .setToken(token)
                    .build();

            stores.storeChannel(channel);

            return ResponseEntity.ok(fromChannel(channel));
        } catch (ApiException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new RequestErrorResponsePayload(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).build();
        }
    }
}

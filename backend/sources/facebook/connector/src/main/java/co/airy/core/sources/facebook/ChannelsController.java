package co.airy.core.sources.facebook;

import co.airy.avro.communication.Channel;
import co.airy.avro.communication.ChannelConnectionState;
import co.airy.core.api.admin.SourceApiException;
import co.airy.core.api.admin.payload.AvailableChannelPayload;
import co.airy.core.api.admin.payload.AvailableChannelsResponsePayload;
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
    public ChannelsController(Api api) {
        this.api = api;
    }

    @PostMapping("/facebook.explore")
    ResponseEntity<?> explore(@RequestBody @Valid ExploreRequestPayload requestPayload) {
        try {
            getAvailableChannels(requestPayload.getPageToken());
        } catch (SourceApiException e) {
            e.printStackTrace();
        }
        return null;
    }

    public List<FacebookMetadata> getAvailableChannels(String token) throws SourceApiException {
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
            throw new SourceApiException(e.getMessage());
        }
    }

    public FacebookMetadata connectChannel(String token, String sourceChannelId) throws SourceApiException {
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
            throw new SourceApiException(e.getMessage());
        }
    }

}

package co.airy.core.api.admin.sources.facebook;

import co.airy.core.api.admin.Source;
import co.airy.core.api.admin.SourceApiException;
import co.airy.core.api.admin.dto.ChannelMetadata;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

import static java.util.stream.Collectors.toList;

@Service
public class FacebookSource implements Source {

    public String getIdentifier() {
        return "facebook";
    }

    @Autowired
    FacebookApi api;

    public List<ChannelMetadata> getAvailableChannels(String token) throws SourceApiException {
        try {
            final List<FbPageWithConnectInfo> allPagesForUser = api.getAllPagesForUser(token);

            return allPagesForUser.stream()
                    .map((page) -> ChannelMetadata.builder()
                            .sourceChannelId(page.getId())
                            .name(page.getNameWithLocationDescriptor())
                            .imageUrl(page.getPicture().getData().getUrl())
                            .build()
                    ).collect(toList());
        } catch (Exception e) {
            throw new SourceApiException(e.getMessage());
        }
    }

    public ChannelMetadata connectChannel(String token, String sourceChannelId) throws SourceApiException  {
        try {
            final String longLivingUserToken = api.exchangeToLongLivingUserAccessToken(token);
            final FbPageWithConnectInfo fbPageWithConnectInfo = api.getPageForUser(sourceChannelId, longLivingUserToken);

            api.connectPageToApp(fbPageWithConnectInfo.getAccessToken());

            return ChannelMetadata.builder()
                    .name(fbPageWithConnectInfo.getNameWithLocationDescriptor())
                    .sourceChannelId(fbPageWithConnectInfo.getId())
                    .imageUrl(fbPageWithConnectInfo.getPicture().getData().getUrl())
                    .build();
        } catch (Exception e) {
            throw new SourceApiException(e.getMessage());
        }
    }

    @Override
    public void disconnectChannel(String token, String sourceChannelId) {

    }
}

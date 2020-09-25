package co.airy.core.api.admin.sources.facebook;

import co.airy.core.api.admin.Source;
import co.airy.core.api.admin.SourceApiException;
import co.airy.core.api.admin.payload.AvailableChannelPayload;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

import static java.util.stream.Collectors.toList;

@Service
public class FacebookSource implements Source {

    public String getIdentifier() {
        return "FACEBOOK";
    }

    @Autowired
    FacebookApi api;

    public List<AvailableChannelPayload> getAvailableChannels(String token) throws SourceApiException {
        try {
            final List<FbPageWithConnectInfo> allPagesForUser = api.getAllPagesForUser(token);

            return allPagesForUser.stream()
                    .map((page) -> AvailableChannelPayload.builder()
                            .sourceChannelId(page.getId())
                            .name(page.getNameWithLocationDescriptor())
                            .imageUrl(page.getPicture().getData().getUrl())
                            .build()
                    ).collect(toList());
        } catch (Exception e) {
            throw new SourceApiException(e.getMessage());
        }
    }
}

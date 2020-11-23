package co.airy.core.api.admin.sources.twilio;

import co.airy.core.api.admin.Source;
import co.airy.core.api.admin.SourceApiException;
import co.airy.core.api.admin.dto.ChannelMetadata;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TwilioSmsSource implements Source {
    @Override
    public String getIdentifier() {
        return "twilio.sms";
    }

    @Override
    public List<ChannelMetadata> getAvailableChannels(String token) throws SourceApiException {
        return List.of();
    }

    @Override
    public ChannelMetadata connectChannel(String token, String sourceChannelId) throws SourceApiException {
        return ChannelMetadata.builder()
                .name("Twilio SMS Channel")
                .sourceChannelId(sourceChannelId)
                .build();
    }

    @Override
    public void disconnectChannel(String token, String sourceChannelId) throws SourceApiException {
    }
}

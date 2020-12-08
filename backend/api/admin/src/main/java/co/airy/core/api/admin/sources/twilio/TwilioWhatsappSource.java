package co.airy.core.api.admin.sources.twilio;

import co.airy.core.api.admin.Source;
import co.airy.core.api.admin.dto.ChannelMetadata;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TwilioWhatsappSource implements Source {
    @Override
    public String getIdentifier() {
        return "twilio.whatsapp";
    }

    @Override
    public List<ChannelMetadata> getAvailableChannels(String token) {
        return List.of();
    }

    @Override
    public ChannelMetadata connectChannel(String token, String sourceChannelId) {
        return ChannelMetadata.builder()
                .name("Twilio Whatsapp Channel")
                .sourceChannelId(sourceChannelId)
                .build();
    }

    @Override
    public void disconnectChannel(String token, String sourceChannelId) {
    }
}

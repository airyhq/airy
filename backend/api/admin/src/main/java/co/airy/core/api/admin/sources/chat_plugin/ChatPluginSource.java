package co.airy.core.api.admin.sources.chat_plugin;

import co.airy.core.api.admin.Source;
import co.airy.core.api.admin.dto.ChannelMetadata;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChatPluginSource implements Source {
    @Override
    public String getIdentifier() {
        return "chat_plugin";
    }

    @Override
    public List<ChannelMetadata> getAvailableChannels(String token) {
        return List.of();
    }

    @Override
    public ChannelMetadata connectChannel(String token, String sourceChannelId) {
        return ChannelMetadata.builder()
                .name("Chat plugin")
                .sourceChannelId(sourceChannelId)
                .build();
    }

    @Override
    public void disconnectChannel(String token, String sourceChannelId) {
    }
}

package co.airy.core.api.admin;

import co.airy.core.api.admin.dto.ChannelMetadata;

import java.util.List;

public interface Source {
    String getIdentifier();

    List<ChannelMetadata> getAvailableChannels(String token) throws SourceApiException;

    ChannelMetadata connectChannel(String token, String sourceChannelId) throws SourceApiException ;
}

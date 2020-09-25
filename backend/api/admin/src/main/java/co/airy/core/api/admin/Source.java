package co.airy.core.api.admin;

import co.airy.core.api.admin.payload.AvailableChannelPayload;

import java.util.List;

public interface Source {
    String getIdentifier();

    List<AvailableChannelPayload> getAvailableChannels(String token) throws SourceApiException;
}

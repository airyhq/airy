import {doFetchFromBackend} from '../api';
import {DisconnectChannelRequestPayload, disconnectChannelApiMapper, ChannelsPayload, channelsMapper} from '../model';

export function disconnectChannel(requestPayload: DisconnectChannelRequestPayload) {
  return doFetchFromBackend('channels.disconnect', disconnectChannelApiMapper(requestPayload))
    .then((response: ChannelsPayload) => {
      const channels = channelsMapper(response);
      return channels;
    })
    .catch((error: Error) => {
      return error;
    });
}

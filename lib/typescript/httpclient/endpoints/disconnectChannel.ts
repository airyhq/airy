import {doFetchFromBackend} from '../api';
import {DisconnectChannelRequestPayload} from '../payload';
import {ChannelsPayload} from '../payload/ChannelsPayload';
import {channelsMapper} from '../mappers/channelsMapper';
import {disconnectChannelApiMapper} from '../mappers/disconnectChannelApiMapper';

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

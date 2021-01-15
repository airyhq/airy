import {doFetchFromBackend} from '../api';
import {ChannelsPayload} from '../payload/ChannelsPayload';
import {channelsMapper} from '../mappers/channelsMapper';

export function listChannels() {
  return doFetchFromBackend('channels.list')
    .then((response: ChannelsPayload) => {
      const channels = channelsMapper(response);
      return channels;
    })
    .catch((error: Error) => {
      return error;
    });
}

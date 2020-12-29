import {doFetchFromBackend} from '../api';
import {ChannelsPayload, channelsMapper} from '../model';

export function getChannels() {
  return doFetchFromBackend('channels.list')
    .then((response: ChannelsPayload) => {
      const channels = channelsMapper(response);
      return channels;
    })
    .catch((error: Error) => {
      return error;
    });
}

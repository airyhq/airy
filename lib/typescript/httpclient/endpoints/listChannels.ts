import {doFetchFromBackend} from '../api';
import {Channel} from '../model';
import {ChannelsPayload} from '../payload';

const channelsMapper = (payload: ChannelsPayload, source?: string): Channel[] => {
  return payload.data.map(
    (entry: Channel): Channel => {
      return {
        source,
        ...entry,
      };
    }
  );
};

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

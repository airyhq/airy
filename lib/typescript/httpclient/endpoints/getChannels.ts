import {doFetchFromBackend} from '../api';
import {Channel} from '../model';
import {ChannelsPayload} from '../payload';

export function getChannels() {
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

  return doFetchFromBackend('channels.list')
    .then((response: ChannelsPayload) => {
      const channels = channelsMapper(response);
      return channels;
    })
    .catch((error: Error) => {
      return error;
    });
}

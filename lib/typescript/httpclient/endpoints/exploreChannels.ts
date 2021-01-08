import {doFetchFromBackend} from '../api';
import {ExploreChannelRequestPayload} from '../payload';
import {Channel} from '../model';
import {ChannelsPayload} from '../payload/ChannelsPayload';

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

export function exploreChannels(requestPayload: ExploreChannelRequestPayload) {
  return doFetchFromBackend('channels.explore', requestPayload)
    .then((response: ChannelsPayload) => {
      const channels = channelsMapper(response, requestPayload.source);
      return channels;
    })
    .catch((error: Error) => {
      return error;
    });
}

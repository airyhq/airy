import {doFetchFromBackend} from '../api';
import {ExploreChannelRequestPayload} from '../payload';
import {ChannelsPayload} from '../payload/ChannelsPayload';
import {channelsMapper} from '../mappers/channelsMapper';

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

import {doFetchFromBackend} from '../api';
import { ChannelsPayload,channelsMapper,ExploreChannelRequestPayload } from '../model';

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
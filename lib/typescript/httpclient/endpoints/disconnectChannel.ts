import {doFetchFromBackend} from '../api';
import {DisconnectChannelRequestPayload, DisconnectChannelRequestApiPayload, ChannelsPayload} from '../payload';
import {Channel} from '../model';

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

const disconnectChannelApiMapper = (payload: DisconnectChannelRequestPayload): DisconnectChannelRequestApiPayload => {
  return {
    channel_id: payload.channelId,
  };
};

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

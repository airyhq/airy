import {doFetchFromBackend} from '../api';
import {ConnectChannelRequestPayload, ConnectChannelRequestApiPayload} from '../payload';
import {Channel} from '../model';
import {ChannelApiPayload} from '../payload/ChannelApiPayload';

const connectChannelApiMapper = (payload: ConnectChannelRequestPayload): ConnectChannelRequestApiPayload => {
  return {
    source: payload.source,
    source_channel_id: payload.sourceChannelId,
    token: payload.token,
    name: payload.name,
    image_url: payload.imageUrl,
  };
};

const channelMapper = (payload: ChannelApiPayload): Channel => {
  return {
    name: payload.name,
    source: payload.source,
    sourceChannelId: payload.source_channel_id,
    imageUrl: payload.image_url,
    connected: true,
  };
};

export function connectChannel(requestPayload: ConnectChannelRequestPayload) {
  return doFetchFromBackend('channels.connect', connectChannelApiMapper(requestPayload))
    .then((response: ChannelApiPayload) => {
      const channel = channelMapper(response);
      return channel;
    })
    .catch((error: Error) => {
      return error;
    });
}

import {ConnectChannelRequestPayload, ConnectChannelRequestApiPayload} from '../payload';

export const connectChannelMapper = (payload: ConnectChannelRequestPayload): ConnectChannelRequestApiPayload => ({
  source_channel_id: payload.sourceChannelId,
  token: payload.token,
  name: payload.name,
  image_url: payload.imageUrl,
});

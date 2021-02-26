import {ConnectChannelRequestPayload, ConnectChannelRequestApiPayload} from '../payload';

export const connectChannelMapper = (payload: ConnectChannelRequestPayload): ConnectChannelRequestApiPayload => ({
  page_id: payload.sourceChannelId,
  page_token: payload.token,
  name: payload.name,
  image_url: payload.imageUrl,
});

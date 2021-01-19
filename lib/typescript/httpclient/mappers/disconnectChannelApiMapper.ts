import {DisconnectChannelRequestPayload, DisconnectChannelRequestApiPayload} from '../payload';

export const disconnectChannelApiMapper = (
  payload: DisconnectChannelRequestPayload
): DisconnectChannelRequestApiPayload => ({
  channel_id: payload.channelId,
});

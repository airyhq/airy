import {DisconnectChannelRequestPayload, DisconnectChannelRequestApiPayload} from '../payload';

export const disconnectChannelApiMapper = (
  payload: DisconnectChannelRequestPayload
): DisconnectChannelRequestApiPayload => {
  return {
    channel_id: payload.channelId,
  };
};

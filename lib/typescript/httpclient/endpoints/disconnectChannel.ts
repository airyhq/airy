import {DisconnectChannelRequestPayload} from '../payload';
import {HttpClient} from '../client';

export const disconnectChannelDef = {
  endpoint: ({source}) => `channels.${source}.disconnect`,
  mapRequest: ({channelId}) => ({channel_id: channelId}),
  mapResponse: response => response,
};

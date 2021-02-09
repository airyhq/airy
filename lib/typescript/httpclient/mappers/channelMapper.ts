import {Channel} from '../model';
import {ChannelApiPayload} from '../payload/ChannelApiPayload';

export const channelMapper = (payload: ChannelApiPayload): Channel => ({
  ...payload,
  sourceChannelId: payload.source_channel_id,
  connected: true,
});

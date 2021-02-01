import {Channel} from '../model';
import {ChannelApiPayload} from '../payload/ChannelApiPayload';

export const channelMapper = (payload: ChannelApiPayload): Channel => ({
  id: payload.id,
  name: payload.name,
  source: payload.source,
  sourceChannelId: payload.source_channel_id,
  imageUrl: payload.image_url,
  connected: true,
});

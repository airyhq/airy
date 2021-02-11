import {Channel} from '../model';
import {ChannelApiPayload} from '../payload/ChannelApiPayload';

export const channelMapper = (payload: ChannelApiPayload): Channel => {
  const channel = {
    ...payload,
    sourceChannelId: payload.source_channel_id,
    metadata: {
      ...payload.metadata,
      imageUrl: payload.metadata.image_url,
    },
    connected: true,
  };
  delete channel.metadata.image_url;
  return channel;
};

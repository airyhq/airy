export interface Channel {
  name: string;
  source: string;
  sourceChannelId: string;
  connected: boolean;
  imageUrl?: string;
}

export interface ChannelApiPayload {
  id: string;
  name: string;
  image_url: string;
  source: string;
  source_channel_id: string;
}

export interface ExploreChannelRequestPayload {
  source: string;
  token: string;
}

export interface ChannelsPayload {
  data: Channel[];
}

export interface ConnectChannelRequestPayload {
  source: string;
  sourceChannelId: string;
  token: string;
  name?: string;
  imageUrl?: string;
}

export interface ConnectChannelRequestApiPayload {
  source: string;
  source_channel_id: string;
  token: string;
  name?: string;
  image_url?: string;
}

export interface DisconnectChannelRequestPayload {
  channelId: string;
}

export interface DisconnectChannelRequestApiPayload {
  channel_id: string;
}

export const channelsMapper = (payload: ChannelsPayload, source?: string): Channel[] => {
  return payload.data.map(
    (entry: Channel): Channel => {
      return {
        source,
        ...entry,
      };
    }
  );
};

export const channelMapper = (payload: ChannelApiPayload): Channel => {
  return {
    name: payload.name,
    source: payload.source,
    sourceChannelId: payload.source_channel_id,
    imageUrl: payload.image_url,
    connected: true,
  };
};

export const connectChannelApiMapper = (payload: ConnectChannelRequestPayload): ConnectChannelRequestApiPayload => {
  return {
    source: payload.source,
    source_channel_id: payload.sourceChannelId,
    token: payload.token,
    name: payload.name,
    image_url: payload.imageUrl,
  };
};

export const disconnectChannelApiMapper = (
  payload: DisconnectChannelRequestPayload
): DisconnectChannelRequestApiPayload => {
  return {
    channel_id: payload.channelId,
  };
};

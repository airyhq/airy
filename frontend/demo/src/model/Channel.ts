export interface Channel {
  name: string;
  source: string;
  source_channel_id: string;
  connected: boolean;
  image_url?: string;
}

export interface ChannelPayload {
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

export interface ConnectChannelRequestPayload {
  source: string;
  source_channel_id: string;
  token: string;
  name?: string;
  image_url?: string;
}
export interface ChannelsPayload {
  data: Channel[];
}

export interface DisconnectChannelRequestPayload {
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

export const channelMapper = (payload: ChannelPayload): Channel => {
  return {
    name: payload.name,
    source: payload.source,
    source_channel_id: payload.source_channel_id,
    image_url: payload.image_url,
    connected: true,
  };
};

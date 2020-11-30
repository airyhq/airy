export interface Channel {
  id: string;
  name: string;
  source: string;
  external_channel_id: string;
  image_url?: string;
}

export function getChannelById(channels: Array<Channel>, id: string) {
  return channels.find(channel => {
    return channel.id === id;
  });
}

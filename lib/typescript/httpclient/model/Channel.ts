export interface Channel {
  id?: string;
  name: string;
  source: string;
  sourceChannelId: string;
  connected: boolean;
  imageUrl?: string;
}

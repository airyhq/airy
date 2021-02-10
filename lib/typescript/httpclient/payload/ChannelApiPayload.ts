export interface ChannelApiPayload {
  id: string;
  metadata: any & {
    name: string;
    image_url?: string;
  };
  source: string;
  source_channel_id: string;
}

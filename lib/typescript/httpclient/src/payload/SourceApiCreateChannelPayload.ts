export interface SourceApiCreateChannelPayload {
  source_channel_id: string;
  name: string; // Optional
  metadata: {
    image_url?: string; // optional
    token?: string; // optional
  };
}

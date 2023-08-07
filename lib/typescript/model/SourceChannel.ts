export interface SourceChannel {
  id: string;
  source: string;
  source_channel_id: string;
  connected: boolean;
  metadata: {
    name: string;
  };
}

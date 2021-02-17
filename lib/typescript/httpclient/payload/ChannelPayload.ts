import {Metadata} from '../model';

export interface ChannelPayload {
  id: string;
  metadata?: Metadata & {
    name: string;
    image_url?: string;
  };
  source: string;
  source_channel_id: string;
  connected: boolean;
}

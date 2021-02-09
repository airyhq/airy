import {ChannelMetadata} from '../model';

export interface ChannelApiPayload {
  id: string;
  name: string;
  metadata: ChannelMetadata;
  image_url: string;
  source: string;
  source_channel_id: string;
}

import {Metadata} from './Metadata';

export type ChannelMetadata = Metadata & {
  name: string;
  image_url?: string;
};

export interface Channel {
  id?: string;
  metadata: ChannelMetadata;
  source: string;
  sourceChannelId: string;
  connected: boolean;
}

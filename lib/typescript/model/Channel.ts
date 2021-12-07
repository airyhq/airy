import {Metadata} from './Metadata';

export type ChannelMetadata = Metadata & {
  name: string;
  imageUrl?: string;
  pageId?: string;
  pageToken?: string;
  accountId?: string;
};

export interface Channel {
  id?: string;
  metadata: ChannelMetadata;
  source: string;
  sourceChannelId: string;
  connected: boolean;
  phoneNumber?: string;
}

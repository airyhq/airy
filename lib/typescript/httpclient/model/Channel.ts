import {Metadata} from './Metadata';

export type ChannelMetadata = Metadata & {
  name: string;
  imageUrl?: string;
};

export interface Channel {
  id?: string;
  metadata: ChannelMetadata;
  source: string;
  sourceChannelId: string;
  connected: boolean;
}

export enum ChannelSource {
  facebook = 'facebook',
  google = 'google',
  chatPlugin = 'chat_plugin',
  twilioSMS = 'twilio.sms',
  twilioWhatsapp = 'twilio.whatsapp',
}

export const channelNameSorter = (channelA: Channel, channelB: Channel) => {
  if (channelA.metadata.name.toLowerCase() < channelB.metadata.name.toLowerCase()) {
    return -1;
  }
  if (channelA.metadata.name.toLowerCase() > channelB.metadata.name.toLowerCase()) {
    return 1;
  }
  return 0;
};

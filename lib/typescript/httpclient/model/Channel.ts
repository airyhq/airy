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

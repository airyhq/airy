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
  phoneNumber?: string;
}

export enum Source {
  facebook = 'facebook',
  google = 'google',
  chatPlugin = 'chatplugin',
  twilioSMS = 'twilio.sms',
  twilioWhatsapp = 'twilio.whatsapp',
}

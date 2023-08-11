import {MetaMapper} from './facebook';
import {ChatpluginMapper} from './chatplugin';
import {GoogleMapper} from './google';
import {TwilioMapper} from './twilio';
import {ViberMapper} from './viber';
import {WhatsAppMapper} from './whatsapp';
import {GoogleProfileMapper} from './googleprofile';

export const getOutboundMapper = (source: string) => {
  switch (source) {
    case 'facebook':
    case 'instagram':
      return new MetaMapper();
    case 'google':
      return new GoogleMapper();
    case 'chatplugin':
      return new ChatpluginMapper();
    case 'twilio.sms':
    case 'twilio.whatsapp':
      return new TwilioMapper();
    case 'viber':
      return new ViberMapper();
    case 'whatsapp':
      return new WhatsAppMapper();
    case 'googleprofiles':
      return new GoogleProfileMapper();
    default: {
      console.error('Unknown source ', source);
    }
  }
};

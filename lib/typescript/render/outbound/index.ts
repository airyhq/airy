import {FacebookMapper} from './facebook';
import {ChatpluginMapper} from './chatplugin';
import {GoogleMapper} from './google';
import {TwilioMapper} from './twilio';
import {ViberMapper} from './viber';

export const getOutboundMapper = (source: string) => {
  switch (source) {
    case 'facebook':
    case 'instagram':
      return new FacebookMapper();
    case 'google':
      return new GoogleMapper();
    case 'chatplugin':
      return new ChatpluginMapper();
    case 'twilio.sms':
    case 'twilio.whatsapp':
      return new TwilioMapper();
    case 'viber':
      return new ViberMapper();
    default: {
      console.error('Unknown source ', source);
    }
  }
};

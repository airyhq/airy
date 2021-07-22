import {FacebookMapper} from './facebook';
import {ChatpluginMapper} from './chatplugin';
import {GoogleMapper} from './google';
import {TwilioMapper} from './twilio';

export const getOutboundMapper = (source: string) => {
  switch (source) {
    case 'facebook':
      return new FacebookMapper();
    case 'google':
      return new GoogleMapper();
    case 'chatplugin':
      return new ChatpluginMapper();
    case 'twilio.sms':
    case 'twilio.whatsapp':
      return new TwilioMapper();
    default: {
      console.error('Unknown source ', source);
    }
  }
};

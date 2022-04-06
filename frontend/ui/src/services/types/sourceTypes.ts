import {Source} from 'model';

export const getSourceType = (source: string): Source => {
  if (source === 'facebook') return Source.facebook;
  if (source === 'google') return Source.google;
  if (source === 'chatplugin') return Source.chatPlugin;
  if (source === 'twilio.whatsapp') return Source.twilioWhatsApp;
  if (source === 'instagram') return Source.instagram;
  if (source === 'viber') return Source.viber;
};

export enum Source {
  facebook = 'facebook',
  google = 'google',
  chatPlugin = 'chatplugin',
  twilioSMS = 'twilio.sms',
  twilioWhatsApp = 'twilio.whatsapp',
  instagram = 'instagram',
  viber = 'viber',
  zendesk = 'zendesk',
  dialogflow = 'dialogflow',
}

export const prettifySource = (source: string) =>
  source
    .split('.')
    .map(word => `${word[0].toUpperCase()}${word.slice(1)}`)
    .join(' ');

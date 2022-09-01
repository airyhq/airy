export enum Source {
  facebook = 'facebook',
  google = 'google',
  chatPlugin = 'chatplugin',
  twilioSMS = 'twilio.sms',
  twilioWhatsApp = 'twilio.whatsapp',
  twilio = 'twilio',
  instagram = 'instagram',
  viber = 'viber',
  zendesk = 'zendesk',
  dialogflow = 'dialogflow',
  salesforce = 'salesforce',
  congnigy = 'congnigy',
  rasa = 'rasa',
  webhooks = 'webhooks',
  amelia = 'amelia',
  mobile = 'mobile',
  whatsapp = 'whatsapp',
  frontendInbox = 'frontend-inbox'
}

export const prettifySource = (source: string) =>
  source
    .split('.')
    .map(word => `${word[0].toUpperCase()}${word.slice(1)}`)
    .join(' ');

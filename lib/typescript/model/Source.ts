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
<<<<<<< HEAD
  whatsapp = 'whatsapp',
=======
  whatsappBusinessCloud = "whatsappBusinessCloud"
>>>>>>> 73d32939 (wip)
}

export const prettifySource = (source: string) =>
  source
    .split('.')
    .map(word => `${word[0].toUpperCase()}${word.slice(1)}`)
    .join(' ');
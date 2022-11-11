export enum Source {
  airyContacts = 'airyContacts',
  airyWebhooks = 'webhooks',
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
  cognigy = 'cognigy',
  rasa = 'rasa',
  amelia = 'amelia',
  mobile = 'mobile',
  whatsapp = 'whatsapp',
  frontendInbox = 'frontend-inbox',
  ibmWatsonAssistant = 'ibmWatsonAssistant',
  amazons3 = 'amazons3',
  amazonLexV2 = 'amazonLexV2',
}

export const airyProduct = Source.airyContacts && Source.airyWebhooks;

export const prettifySource = (source: string) =>
  source
    .split('.')
    .map(word => `${word[0].toUpperCase()}${word.slice(1)}`)
    .join(' ');

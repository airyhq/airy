export enum Source {
  airyContacts = 'airyContacts',
  airyMobile = 'mobile',
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
  whatsapp = 'whatsapp',
  frontendInbox = 'frontend-inbox',
  ibmWatsonAssistant = 'ibmWatsonAssistant',
  redis = 'redis',
  postgres = 'postgres',
  amazons3 = 'amazons3',
  amazonLexV2 = 'amazonLexV2',
}

export enum SourceApps {
  redis = 'redis',
  postgres = 'postgres',
}

export const isApp = (source: string): boolean => {
  switch (source) {
    case SourceApps.postgres:
    case SourceApps.redis:
      return true;
  }
  return false;
};

export const prettifySource = (source: string) =>
  source
    .split('.')
    .map(word => `${word[0].toUpperCase()}${word.slice(1)}`)
    .join(' ');

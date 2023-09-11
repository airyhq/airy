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
  postgresql = 'postgresql',
  feast = 'feast',
  faiss = 'faiss',
  faissConnector = 'faissConnector',
  llama2 = 'llama2',
  openaiConnector = 'openaiConnector',
  pineconeConnector = 'pineconeConnector',
  chroma = 'chroma',
  mosaic = 'mosaic',
  weaviate = 'weaviate',
  gmail = 'gmail',
  amazons3 = 'amazons3',
  amazonLexV2 = 'amazonLexV2',
  integrationSourceApi = 'integrationSourceApi',
}

export enum SourceApps {
  redis = 'redis',
  postgresql = 'postgresql',
  faiss = 'faiss',
}

export const isApp = (source: string): boolean => {
  switch (source) {
    case SourceApps.postgresql:
    case SourceApps.redis:
    case SourceApps.faiss:
      return true;
  }
  return false;
};

export const isAiryComponent = (source: string): boolean => {
  switch (source) {
    case Source.airyContacts:
    case Source.airyMobile:
    case Source.airyWebhooks:
    case Source.integrationSourceApi:
      return true;
  }
  return false;
};

export const prettifySource = (source: string) =>
  source
    .split('.')
    .map(word => `${word[0].toUpperCase()}${word.slice(1)}`)
    .join(' ');

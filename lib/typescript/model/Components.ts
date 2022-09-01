import {Source} from './Source';

export interface Components {
  components: {
    [key: string]: {
      [key: string]: string | boolean;
    };
  };
}

export interface ComponentInfo {
  displayName: string;
  name: string;
  installed: boolean;
  isChannel?: string;
  availableFor: string;
  description: string;
  category: string;
  price: string;
  docs: string;
  source: Source;
}

export enum ComponentRepository {
  airyCore = 'airy-core',
  airyEnterprise = 'airy-enterprise',
  airyCloud = 'airy-cloud',
}

export enum ComponentName {
  apiAdmin = 'api-admin',
  apiCommunication = 'api-communication',
  apiContacts = 'api-contacts',
  apiWebsocket = 'api-websocket',
  cloudConnector = 'cloud-connector',
  enterpriseDialogflowConnector = 'enterprise-dialogflow-connector',
  enterpriseMobileAuth = 'enterprise-mobile-auth',
  enterpriseSalesforceContactsIngestion = 'enterprise-salesforce-contacts-ingestion',
  enterprisePushNotification = 'enterprise-push-notifiction',
  enterpriseZendenkConnector = 'enterprise-zendesk-connector',
  frontendControlCenter = 'frontend-control-center',
  frontendInbox = 'frontend-inbox',
  integrationSourceApi = 'integration-source-api',
  integrationWebhook = 'integration-webhook',
  mediaResolver = 'media-resolver',
  sourcesChatPlugin = 'sources-chatplugin',
  sourcesFacebook = 'sources-facebook',
  sourcesGoogle = 'sources-google',
  sourcesTwilio = 'sources-twilio',
  sourcesViber = 'sources-viber',
  sourcesWhatsappBusinessCloud = 'sources-whatsapp-business-cloud',
  rasaConnector = 'rasa-connector',
}

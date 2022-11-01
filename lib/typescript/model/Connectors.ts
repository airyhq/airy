import {Source} from './Source';

export enum ConnectorName {
  amazonLexV2 = 'amazon-lex-v2-connector',
  apiAdmin = 'api-admin',
  apiCommunication = 'api-communication',
  apiContacts = 'api-contacts',
  apiWebsocket = 'api-websocket',
  cloudConnector = 'cloud-connector',
  enterpriseDialogflowConnector = 'enterprise-dialogflow-connector',
  enterpriseMobileAuth = 'enterprise-mobile-auth',
  salesforceContactsIngestion = 'salesforce-contacts-ingestion',
  enterprisePushNotification = 'enterprise-push-notifiction',
  frontendControlCenter = 'frontend-control-center',
  frontendInbox = 'frontend-inbox',
  integrationSourceApi = 'integration-source-api',
  integrationWebhook = 'integration-webhook',
  mediaResolver = 'media-resolver',
  sourcesChatPlugin = 'sources-chatplugin',
  sourcesFacebook = 'sources-facebook',
  sourcesGoogle = 'sources-google',
  sourcesTwilio = 'sources-twilio',
  sourcesWhatsappBusinessCloud = 'sources-whatsapp-business-cloud',
  sourcesViber = 'sources-viber',
  rasaConnector = 'rasa-connector',
  zendenkConnector = 'zendesk-connector',
}

export enum InstallationStatus {
  installed = 'installed',
  pending = 'pending',
  uninstalled = 'uninstalled',
}

export enum ConnectorPrice {
  free = 'Free',
  paid = 'Paid',
  requestAccess = 'REQUEST ACCESS',
}

export type Connector = {
  name?: string;
  displayName?: string;
  installationStatus?: InstallationStatus;
  isEnabled?: boolean;
  isHealthy?: boolean;
  isConfigured?: boolean;
  configureValues?: {};
  isChannel?: boolean;
  connectedChannels?: number;
  price?: string;
  source?: Source;
};

export type ConnectorsModel = {
  [connectorName: string]: Connector;
};

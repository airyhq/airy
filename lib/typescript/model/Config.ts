import {User} from './User';

export enum ConfigServices {
  apiAdmin = 'api-admin',
  apiCommunication = 'api-communication',
  apiContacts = 'api-contacts',
  apiWebsocket = 'api-websocket',
  cloudConnector = 'cloud-connector',
  enterpriseDialogflowConnector = 'enterprise-dialog-connector',
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
}

export interface Config {
  services: {[key: string]: {enabled: boolean; healthy: boolean; component: string}};
  tagConfig?: {
    colors: {[id: string]: ColorSettings};
  };
  userProfile?: User;
  clusterVersion: string;
}

export interface ColorSettings {
  default: string;
  background: string;
  font: string;
  position: number;
  border: string;
}

export enum Language {
  german = 'German',
  english = 'English (US)',
  french = 'French',
  spanish = 'Spanish',
}

export const getComponents = (config: Config) => {
  const {services} = config;

  return Object.keys(services).reduce((agg, key) => {
    const {healthy, enabled, component} = services[key];

    return {
      ...agg,
      [component]: {
        enabled,
        // A component is only healthy if all its services are healthy
        healthy: agg[component] ? agg[component].healthy && healthy : healthy,
        services: agg[component]
          ? [...agg[component].services, {name: key, healthy: healthy}]
          : [{name: key, healthy: healthy}],
      },
    };
  }, {});
};

export const getClusterVersion = (config: Config) => {
  return config.clusterVersion;
};

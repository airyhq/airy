import {CONNECTORS_ROUTE, CATALOG_ROUTE, WEBHOOKS_ROUTE} from '../routes/routes';
import {Source} from 'model';

export const getConnectedRouteForComponent = (
  source: Source,
  isChannel?: boolean,
  hasConnectedChannels?: boolean,
  configured?: boolean
) => {
  if (source === Source.airyWebhooks) return WEBHOOKS_ROUTE;

  if ((!configured || !isChannel) && source !== Source.chatPlugin) return `${CONNECTORS_ROUTE}/${source}/configure`;

  if (configured && hasConnectedChannels) return `${CONNECTORS_ROUTE}/${source}/connected`;

  if (configured && !hasConnectedChannels) return `${CONNECTORS_ROUTE}/${source}/new`;

  return `${CONNECTORS_ROUTE}/${source}/connected`;
};

export const getNewChannelRouteForComponent = (source: Source, isChannel?: boolean, configured?: boolean) => {
  if (source === Source.airyWebhooks) return WEBHOOKS_ROUTE;

  if ((!configured || !isChannel) && source !== Source.chatPlugin) return `${CONNECTORS_ROUTE}/${source}/configure`;

  return `${CONNECTORS_ROUTE}/${source}/new`;
};

export const getCatalogProductRouteForComponent = (source: Source) => {
  return `${CATALOG_ROUTE}/${source}`;
};

import {CONNECTORS_ROUTE, CATALOG_ROUTE, WEBHOOKS_ROUTE, APPS_ROUTE} from '../routes/routes';
import {Source} from 'model';

export const getConnectedRouteForComponent = (
  source: Source,
  isChannel?: boolean,
  isApp?: boolean,
  hasConnectedChannels?: boolean,
  configured?: boolean
) => {
  if (source === Source.airyWebhooks) return WEBHOOKS_ROUTE;

  let baseRoute = CONNECTORS_ROUTE;

  if (isApp === true) {
    baseRoute = APPS_ROUTE;
  }

  if ((!configured || !isChannel) && source !== Source.chatPlugin) return `${baseRoute}/${source}/configure`;

  if (configured && hasConnectedChannels) return `${baseRoute}/${source}/connected`;

  if (configured && !hasConnectedChannels) return `${baseRoute}/${source}/new`;

  return `${baseRoute}/${source}/connected`;
};

export const getNewChannelRouteForComponent = (
  source: Source,
  isChannel?: boolean,
  isApp?: boolean,
  configured?: boolean
) => {
  if (source === Source.airyWebhooks) return WEBHOOKS_ROUTE;

  let baseRoute = CONNECTORS_ROUTE;
  if (isApp === true) {
    baseRoute = APPS_ROUTE;
    return `${baseRoute}/`;
  }

  if ((!configured || !isChannel) && source !== Source.chatPlugin) return `${baseRoute}/${source}/configure`;

  return `${baseRoute}/${source}/new`;
};

export const getCatalogProductRouteForComponent = (source: Source) => {
  return `${CATALOG_ROUTE}/${source}`;
};

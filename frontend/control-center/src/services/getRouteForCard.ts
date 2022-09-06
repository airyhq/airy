import {CONNECTORS_ROUTE, CATALOG_ROUTE, WEBHOOKS_ROUTE} from '../routes/routes';
import {Source} from 'model';

export const getConnectedRouteForComponent = (source: Source, isChannel: string) => {
  if (source === Source.webhooks) return WEBHOOKS_ROUTE;

  if (isChannel) return `${CONNECTORS_ROUTE}/${source}/connected`;

  return `${CONNECTORS_ROUTE}/${source}/new`;
};

export const getNewChannelRouteForComponent = (source: Source) => {
  return source === Source.webhooks ? WEBHOOKS_ROUTE : `${CONNECTORS_ROUTE}/${source}/new`;
};

export const getCatalogProductRouteForComponent = (source: Source) => {
  return `${CATALOG_ROUTE}/${source}`;
};

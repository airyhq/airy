import camelcaseKeys from 'camelcase-keys';

export const unsubscribeWebhookDef = {
  endpoint: 'webhooks.unsubscribe',
  mapResponse: response => camelcaseKeys(response),
};

import camelcaseKeys from 'camelcase-keys';

export const subscribeWebhookDef = {
  endpoint: 'webhooks.subscribe',
  mapResponse: response => camelcaseKeys(response),
};

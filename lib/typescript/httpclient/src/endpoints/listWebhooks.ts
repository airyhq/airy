import camelcaseKeys from 'camelcase-keys';

export const listWebhooksDef = {
  endpoint: 'webhooks.list',
  mapResponse: response => camelcaseKeys(response.data),
};

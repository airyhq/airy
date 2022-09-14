import camelcaseKeys from 'camelcase-keys';

export const updateWebhookDef = {
  endpoint: 'webhooks.update',
  mapResponse: response => camelcaseKeys(response),
};

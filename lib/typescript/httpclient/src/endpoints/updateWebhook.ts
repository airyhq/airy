/* eslint-disable @typescript-eslint/no-var-requires */
const camelcaseKeys = require('camelcase-keys');

export const updateWebhookDef = {
  endpoint: 'webhooks.update',
  mapResponse: response => camelcaseKeys(response.data),
};

/* eslint-disable @typescript-eslint/no-var-requires */
const camelcaseKeys = require('camelcase-keys');

export const listWebhooksDef = {
  endpoint: 'webhooks.list',
  mapResponse: response => camelcaseKeys(response.data),
};

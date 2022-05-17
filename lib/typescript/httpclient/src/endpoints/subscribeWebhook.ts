/* eslint-disable @typescript-eslint/no-var-requires */
const camelcaseKeys = require('camelcase-keys');

export const subscribeWebhookDef = {
  endpoint: 'webhooks.subscribe',
  mapResponse: response => camelcaseKeys(response),
};

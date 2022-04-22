/* eslint-disable @typescript-eslint/no-var-requires */
const camelcaseKeys = require('camelcase-keys');

export const unsubscribeWebhookDef = {
  endpoint: 'webhooks.unsubscribe',
  mapResponse: response => camelcaseKeys(response.data),
};

/* eslint-disable @typescript-eslint/no-var-requires */
const camelcaseKeys = require('camelcase-keys');

export const listTemplatesDef = {
  endpoint: 'templates.list',
  mapRequest: req => req,
  mapResponse: response => camelcaseKeys(response.data),
};

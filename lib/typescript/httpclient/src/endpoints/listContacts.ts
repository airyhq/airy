/* eslint-disable @typescript-eslint/no-var-requires */
const camelcaseKeys = require('camelcase-keys');

export const listContactsDef = {
  endpoint: 'contacts.list',
  mapResponse: response => camelcaseKeys(response.data, {deep: true}),
};
/* eslint-disable @typescript-eslint/no-var-requires */
const camelcaseKeys = require('camelcase-keys');

export const loginViaEmailDef = {
  endpoint: 'users.login',
  mapResponse: response => ({...camelcaseKeys(response), displayName: `${response.first_name} ${response.last_name}`}),
  opts: {ignoreAuthToken: true},
};

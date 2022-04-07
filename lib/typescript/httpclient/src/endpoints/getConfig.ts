/* eslint-disable @typescript-eslint/no-var-requires */
const camelcaseKeys = require('camelcase-keys');

export const getConfigDef = {
  endpoint: 'client.config',
  mapResponse: response => camelcaseKeys(response, {deep: true, stopPaths: ['components', 'tag_config']}),
};

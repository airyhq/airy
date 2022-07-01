/* eslint-disable @typescript-eslint/no-var-requires */
import camelcaseKeys from 'camelcase-keys';

export const getConfigDef = {
  endpoint: 'client.config',
  mapResponse: response => camelcaseKeys(response, {deep: true, stopPaths: ['components', 'tag_config', 'services']}),
};

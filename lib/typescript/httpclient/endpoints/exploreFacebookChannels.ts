/* eslint-disable @typescript-eslint/no-var-requires */
const camelcaseKeys = require('camelcase-keys');

export const exploreFacebookChannelsDef = {
  endpoint: 'facebook.channels.explore',
  mapRequest: requestPayload => requestPayload,
  mapResponse: response => camelcaseKeys(response.data, {deep: true, stopPaths: ['metadata.user_data']}),
};

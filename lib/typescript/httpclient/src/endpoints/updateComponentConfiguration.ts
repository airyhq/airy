/* eslint-disable @typescript-eslint/no-var-requires */
const camelcaseKeys = require('camelcase-keys');

export const updateComponentConfigurationDef = {
  endpoint: 'components.update',
  mapRequest: requestPayload => ({
    components: requestPayload.components,
  }),
  mapResponse: response => response,
};

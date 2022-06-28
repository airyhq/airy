export const updateComponentConfigurationDef = {
  endpoint: 'components.update',
  mapRequest: requestPayload => ({
    components: requestPayload.components,
  }),
  mapResponse: response => response,
};

export const enableDisableComponentDef = {
  endpoint: 'components.update',
  mapRequest: requestPayload => ({
    components: requestPayload.components,
  }),
  mapResponse: response => response,
};

import camelcaseKeys from 'camelcase-keys';

export const listTemplatesDef = {
  endpoint: 'templates.list',
  mapResponse: response => camelcaseKeys(response.data),
};

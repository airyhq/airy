import camelcaseKeys from 'camelcase-keys';

export const llmConsumersDeleteDef = {
  endpoint: 'llm-consumers.delete',
  mapResponse: response => camelcaseKeys(response),
};

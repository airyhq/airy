import camelcaseKeys from 'camelcase-keys';

export const llmConsumersListDef = {
  endpoint: 'llm-consumers.list',
  mapResponse: response => camelcaseKeys(response),
};

import camelcaseKeys from 'camelcase-keys';

export const llmQueryDef = {
  endpoint: 'llm.query',
  mapResponse: response => camelcaseKeys(response),
};

import camelcaseKeys from 'camelcase-keys';

export const llmStatsDef = {
  endpoint: 'llm.stats',
  mapResponse: response => camelcaseKeys(response),
};

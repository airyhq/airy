import camelcaseKeys from 'camelcase-keys';

export const llmInfoDef = {
  endpoint: 'llm.info',
  mapResponse: response => camelcaseKeys(response),
};

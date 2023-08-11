import camelcaseKeys from 'camelcase-keys';

export const suggestedRepliesDef = {
  endpoint: 'messages.suggest-replies',
  mapResponse: response => camelcaseKeys(response),
};

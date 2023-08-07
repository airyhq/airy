import camelcaseKeys from 'camelcase-keys';

export const sourceApiCreateChannelDef = {
  endpoint: 'sources.channels.create',
  mapResponse: response => camelcaseKeys(response),
};

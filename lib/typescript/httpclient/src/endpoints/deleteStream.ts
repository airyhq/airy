import camelcaseKeys from 'camelcase-keys';

export const deleteStreamDef = {
  endpoint: 'streams.delete',
  mapRequest: name => name,
  mapResponse: response => camelcaseKeys(response),
};

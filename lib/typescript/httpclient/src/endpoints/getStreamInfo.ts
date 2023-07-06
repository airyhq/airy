import camelcaseKeys from 'camelcase-keys';

export const getStreamInfoDef = {
  endpoint: 'streams.info',
  mapRequest: name => name,
  mapResponse: response => camelcaseKeys(response),
};

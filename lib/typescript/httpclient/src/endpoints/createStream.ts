import camelcaseKeys from 'camelcase-keys';

export const createStreamDef = {
  endpoint: 'streams.create',
  mapRequest: payload => payload,
  mapResponse: response => camelcaseKeys(response),
};

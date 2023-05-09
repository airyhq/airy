import camelcaseKeys from 'camelcase-keys';

export const getStreamsDef = {
  endpoint: 'streams.list',
  mapResponse: response => camelcaseKeys(response, {deep: true, stopPaths: ['metadata.user_data']}),
};

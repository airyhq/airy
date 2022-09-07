import camelcaseKeys from 'camelcase-keys';

export const listChannelsDef = {
  endpoint: 'channels.list',
  mapResponse: response => camelcaseKeys(response.data, {deep: true, stopPaths: ['metadata.user_data']}),
};

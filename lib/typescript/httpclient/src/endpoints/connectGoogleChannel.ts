import camelcaseKeys from 'camelcase-keys';

export const connectGoogleChannelDef = {
  endpoint: 'channels.google.connect',
  mapRequest: ({gmbId, name, imageUrl}) => ({
    gbm_id: gmbId,
    name: name,
    image_url: imageUrl,
  }),
  mapResponse: response => camelcaseKeys(response, {deep: true, stopPaths: ['metadata.user_data']}),
};

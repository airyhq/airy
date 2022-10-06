import camelcaseKeys from 'camelcase-keys';

export const connectViberChannelDef = {
  endpoint: 'channels.viber.connect',
  mapRequest: ({name, imageUrl}) => ({
    name,
    image_url: imageUrl,
  }),
  mapResponse: response => camelcaseKeys(response, {deep: true, stopPaths: ['metadata.user_data']}),
};

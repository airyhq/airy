import camelcaseKeys from 'camelcase-keys';

export const connectFacebookChannelDef = {
  endpoint: 'channels.facebook.connect',
  mapRequest: ({pageId, pageToken, name, imageUrl}) => ({
    page_id: pageId,
    page_token: pageToken,
    name: name,
    image_url: imageUrl,
  }),
  mapResponse: response => camelcaseKeys(response, {deep: true, stopPaths: ['metadata.user_data']}),
};

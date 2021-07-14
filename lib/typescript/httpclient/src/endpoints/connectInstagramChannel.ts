/* eslint-disable @typescript-eslint/no-var-requires */
const camelcaseKeys = require('camelcase-keys');

export const connectInstagramChannelDef = {
  endpoint: 'channels.instagram.connect',
  mapRequest: ({pageId, pageToken, accountId, name, imageUrl}) => ({
    page_id: pageId,
    page_token: pageToken,
    accountId: accountId,
    name: name,
    image_url: imageUrl,
  }),
  mapResponse: response => camelcaseKeys(response, {deep: true, stopPaths: ['metadata.user_data']}),
};

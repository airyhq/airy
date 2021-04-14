/* eslint-disable @typescript-eslint/no-var-requires */
const camelcaseKeys = require('camelcase-keys');

export const updateChannelDef = {
  endpoint: 'channels.update',
  mapRequest: requestPayload => ({
    channel_id: requestPayload.channelId,
    name: requestPayload.name,
    ...(requestPayload.imageUrl && {
      image_url: requestPayload.imageUrl,
    }),
  }),
  mapResponse: response => camelcaseKeys(response, {deep: true, stopPaths: ['metadata.user_data']}),
};

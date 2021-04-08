/* eslint-disable @typescript-eslint/no-var-requires */
const camelcaseKeys = require('camelcase-keys');

export const connectChatPluginChannelDef = {
  endpoint: 'channels.chatplugin.connect',
  mapRequest: req => req,
  mapResponse: response => camelcaseKeys(response, {deep: true, stopPaths: ['metadata.user_data']}),
};

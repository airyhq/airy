import camelcaseKeys from 'camelcase-keys';

export const connectChatPluginChannelDef = {
  endpoint: 'channels.chatplugin.connect',
  mapResponse: response => camelcaseKeys(response, {deep: true, stopPaths: ['metadata.user_data']}),
};

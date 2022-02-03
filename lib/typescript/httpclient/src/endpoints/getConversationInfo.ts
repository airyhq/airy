/* eslint-disable @typescript-eslint/no-var-requires */
const camelcaseKeys = require('camelcase-keys');

export const getConversationInfoDef = {
  endpoint: 'conversations.info',
  mapRequest: conversationId => ({
    conversation_id: conversationId,
  }),
  mapResponse: response =>
    camelcaseKeys(response, {deep: true, stopPaths: ['metadata.user_data', 'metadata.notes', 'metadata.tags']}),
};

import camelcaseKeys from 'camelcase-keys';

export const getConversationInfoDef = {
  endpoint: 'conversations.info',
  mapRequest: conversationId => ({
    conversation_id: conversationId,
  }),
  mapResponse: response => camelcaseKeys(response, {deep: true, stopPaths: ['metadata.user_data']}),
};

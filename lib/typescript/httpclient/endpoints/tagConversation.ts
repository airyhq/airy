export const tagConversationDef = {
  endpoint: 'conversations.tag',
  mapRequest: ({conversationId, tagId}) => ({
    conversation_id: conversationId,
    tag_id: tagId,
  }),
  mapResponse: response => response,
};

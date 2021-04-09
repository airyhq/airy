export const untagConversationDef = {
  endpoint: 'conversations.untag',
  mapRequest: ({conversationId, tagId}) => ({
    conversation_id: conversationId,
    tag_id: tagId,
  }),
  mapResponse: response => response,
};

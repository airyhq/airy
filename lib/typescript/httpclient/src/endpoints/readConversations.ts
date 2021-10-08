export const readConversationsDef = {
  endpoint: 'conversations.mark-read',
  mapRequest: conversationId => ({conversation_id: conversationId}),
};

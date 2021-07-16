export const readConversationsDef = {
  endpoint: 'conversations.markRead',
  mapRequest: conversationId => ({conversation_id: conversationId}),
};

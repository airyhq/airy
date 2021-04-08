export const readConversationsDef = {
  endpoint: 'conversations.read',
  mapRequest: conversationId => ({conversation_id: conversationId}),
  mapResponse: response => response,
};

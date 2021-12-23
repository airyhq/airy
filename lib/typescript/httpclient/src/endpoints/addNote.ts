export const addNoteDef = {
  endpoint: 'conversations.addNote',
  mapRequest: ({conversationId, text}) => ({
    conversation_id: conversationId,
    text: text,
  }),
};

export const addNoteDef = {
  endpoint: 'conversations.add-note',
  mapRequest: ({conversationId, text}) => ({
    conversation_id: conversationId,
    text: text,
  }),
};

export const updateNoteDef = {
  endpoint: 'conversations.updateNote',
  mapRequest: ({conversationId, noteId, text}) => ({
    conversation_id: conversationId,
    note_id: noteId,
    text: text,
  }),
};

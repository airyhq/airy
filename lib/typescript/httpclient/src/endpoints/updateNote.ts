export const updateNoteDef = {
  endpoint: 'conversations.update-note',
  mapRequest: ({conversationId, noteId, text}) => ({
    conversation_id: conversationId,
    note_id: noteId,
    text: text,
  }),
};

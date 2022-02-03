export const deleteNoteDef = {
  endpoint: 'conversations.delete-note',
  mapRequest: ({conversationId, noteId}) => ({
    conversation_id: conversationId,
    note_id: noteId,
  }),
};

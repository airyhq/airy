export const deleteNoteDef = {
  endpoint: 'conversations.deleteNote',
  mapRequest: ({conversationId, noteId}) => ({
    conversation_id: conversationId,
    note_id: noteId,
  }),
};

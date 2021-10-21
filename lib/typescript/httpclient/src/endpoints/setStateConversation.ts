import {SetStateConversationRequestPayload} from '../payload/SetStateConversationRequestPayload';

export const setStateConversationDef = {
  endpoint: 'conversations.set-state',
  mapRequest: (request: SetStateConversationRequestPayload) => ({
    conversation_id: request.conversationId,
    state: request.state,
  }),
};

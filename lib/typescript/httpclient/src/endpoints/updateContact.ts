import {UpdateContactRequestPayload} from '../payload';

export const updateContactDef = {
  endpoint: 'conversations.updateContact',
  mapRequest: (request: UpdateContactRequestPayload) => ({
    conversation_id: request.conversationId,
    display_name: request.displayName,
  }),
};

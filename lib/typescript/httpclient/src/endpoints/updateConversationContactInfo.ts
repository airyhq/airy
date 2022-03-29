import {UpdateConversationContactInfoRequestPayload} from '../payload';

export const updateConversationContactInfoDef = {
  endpoint: 'conversations.update-contact',
  mapRequest: (request: UpdateConversationContactInfoRequestPayload) => ({
    conversation_id: request.conversationId,
    display_name: request.displayName,
  }),
};

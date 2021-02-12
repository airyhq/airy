import {Conversation, WithConversationMetadata} from '../model';
import {ConversationPayload} from '../payload/ConversationPayload';
import {messageMapper} from './messageMapper';

export const conversationMapper = (payload: ConversationPayload): WithConversationMetadata<Conversation> => {
  return {
    id: payload.id,
    channel: payload.channel,
    metadata: {
      ...payload.metadata,
      contact: {
        displayName: payload.metadata.contact.display_name,
        avatarUrl: payload.metadata.contact.avatar_url,
      },
      unreadCount: payload.metadata.unread_count,
    },
    createdAt: new Date(payload.created_at),
    tags: Object.keys(payload.metadata.tags),
    lastMessage: messageMapper(payload.last_message),
  };
};

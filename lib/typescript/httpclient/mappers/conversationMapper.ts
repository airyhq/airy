import {Conversation} from '../model';
import {ConversationPayload} from '../payload';
import {messageMapper} from './messageMapper';

export const conversationMapper = (payload: ConversationPayload): Conversation => {
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
    lastMessage: messageMapper(payload.last_message),
  };
};

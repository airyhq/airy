import {Conversation} from '../model';
import {ConversationPayload} from '../payload/ConversationPayload';
import {messageMapper} from './messageMapper';

export const conversationMapper = (payload: ConversationPayload): Conversation => ({
  id: payload.id,
  channel: payload.channel,
  createdAt: new Date(payload.created_at),
  contact: {
    avatarUrl: payload.contact.avatar_url,
    displayName: payload.contact.display_name,
    id: payload.contact.id,
  },
  tags: payload.tags,
  lastMessage: messageMapper(payload.last_message),
  unreadMessageCount: payload.unread_message_count,
});

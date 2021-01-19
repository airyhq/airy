import {Conversation} from '../model';
import {ConversationPayload} from '../payload/ConversationPayload';
import {messageMapper} from './messageMapper';

export const conversationMapper = (payload: ConversationPayload): Conversation => ({
  id: payload.id,
  channel: payload.channel,
  createdAt: payload.created_at,
  contact: {
    avatarUrl: payload.contact.avatar_url,
    firstName: payload.contact.first_name,
    lastName: payload.contact.last_name,
    displayName: payload.contact.first_name + ' ' + payload.contact.last_name,
    id: payload.contact.id,
  },
  tags: payload.tags,
  lastMessage: messageMapper(payload.last_message),
  unreadMessageCount: payload.unread_message_count,
});

import {Channel} from './Channel';
import {Message, messageMapper, MessagePayload} from './Message';
import {ResponseMetadata} from './ResponseMetadata';

export interface Conversation {
  id: string;
  channel: Channel;
  createdAt: string;
  contact: {
    avatarUrl: string;
    firstName: string;
    lastName: string;
    displayName: string;
    id: string;
  };
  tags: string[];
  lastMessage: Message;
  unreadMessageCount?: number;
}

export interface ConversationPayload {
  id: string;
  channel: Channel;
  created_at: string;
  contact: {
    avatar_url: string;
    first_name: string;
    last_name: string;
    id: string;
  };
  tags: string[];
  last_message: MessagePayload;
  unread_message_count?: number;
}

export interface FetchConversationsResponse {
  data: ConversationPayload[];
  metadata: ResponseMetadata;
}

export const conversationMapper = (payload: ConversationPayload): Conversation => {
  const conversation: Conversation = {
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
  };
  return conversation;
};

export const conversationsMapper = (payloadArray: ConversationPayload[]): Conversation[] => {
  const conversations: Conversation[] = [];
  payloadArray.forEach((conversation: ConversationPayload) => {
    conversations.push(conversationMapper(conversation));
  });
  return conversations;
};



import {Contact} from './Contact';
import {Message} from './Message';
import {Metadata} from './Metadata';
import {Channel} from './Channel';

export type ConversationMetadata = Metadata & {
  contact: Contact;
  unreadCount: number;
  tags: {
    [tagId: string]: string;
  };
};

export interface Conversation {
  id: string;
  channel: Channel;
  metadata: ConversationMetadata;
  createdAt: Date;
  lastMessage: Message;
}

export function getTags(conversation: Conversation) {
  return Object.keys(conversation.metadata.tags || {});
}

export function getSource(conversation: Conversation) {
  return conversation?.channel?.source;
}

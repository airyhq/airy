import {Contact} from './Contact';
import {Message} from './Message';
import {Metadata} from './Metadata';
import {Channel} from './Channel';

export type ConversationMetadata = Metadata & {
  contact: Contact;
  unreadCount: number;
};

export interface Conversation {
  id: string;
  channel: Channel;
  metadata: ConversationMetadata;
  createdAt: Date;
  tags: string[];
  lastMessage: Message;
}

export function getSource(conversation: Conversation) {
  return conversation?.channel?.source;
}

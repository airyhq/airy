import {Message} from './Message';
import {Metadata} from './Metadata';
import {Channel} from './Channel';

export interface ContactInfo {
  displayName: string;
  avatarUrl?: string;
}

export type ConversationMetadata = Metadata & {
  contact: ContactInfo;
  unreadCount: number;
  tags: {
    [tagId: string]: string;
  };
  state: string;
};

export interface Conversation {
  id: string;
  channel: Channel;
  metadata: ConversationMetadata;
  createdAt: Date;
  lastMessage: Message;
}

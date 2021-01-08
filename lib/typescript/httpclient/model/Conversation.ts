import {Channel} from './Channel';
import {Message} from './Message';

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

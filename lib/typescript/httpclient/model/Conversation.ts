import {Channel} from './Channel';
import {Contact} from './Contact';
import {Message} from './Message';

export interface Conversation {
  id: string;
  channel: Channel;
  createdAt: Date;
  contact: Contact;
  tags: string[];
  lastMessage: Message;
  unreadMessageCount?: number;
}

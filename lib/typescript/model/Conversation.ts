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
  notes: {
    [noteId: string]: string;
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

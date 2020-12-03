import {Channel} from './Channel';
import {Contact} from './Contact';
import {Message} from './Message';

export enum ConversationStateEnum {
  open = 'OPEN',
  closed = 'CLOSED',
}

export interface Conversation {
  id: string;
  state: ConversationStateEnum;
  contact?: Contact;
  created_at: string;
  channel?: Channel;
  source?: Channel;
  last_message: Message;
  unread_message_count?: number;
}

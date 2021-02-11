import {Channel} from '../model';
import {MessagePayload} from './MessagePayload';

export interface ConversationPayload {
  id: string;
  channel: Channel;
  created_at: string;
  contact: {
    avatar_url: string;
    display_name: string;
    id: string;
  };
  tags: string[];
  last_message: MessagePayload;
  unread_count?: number;
}

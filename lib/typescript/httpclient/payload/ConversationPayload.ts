import {Channel} from '../model';
import {MessagePayload} from './MessagePayload';

export interface ConversationMetadataPayload {
  contact: {
    avatar_url?: string;
    display_name: string;
  };
  tags: {
    [tagId: string]: string;
  };
  unread_count: number;
}

export interface ConversationPayload {
  id: string;
  channel: Channel;
  created_at: string;
  metadata: ConversationMetadataPayload;
  last_message: MessagePayload;
}

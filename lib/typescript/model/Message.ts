import camelcaseKeys from 'camelcase-keys';
import {Content} from './Content';
import {Suggestions} from './SuggestedReply';

export enum MessageType {
  audio = 'audio',
  file = 'file',
  image = 'image',
  text = 'text',
  video = 'video',
}

export enum DeliveryState {
  pending = 'pending',
  failed = 'failed',
  delivered = 'delivered',
}

export interface Message {
  id: string;
  content: Content;
  deliveryState: DeliveryState;
  fromContact: boolean;
  sentAt: Date;
  metadata?: MessageMetadata;
  sender: MessageSender;
}

export interface MessageMetadata {
  suggestions?: Suggestions;
  reaction?: {
    emoji: string;
    sentAt: string;
  };
  sentFrom?: string;
}

export interface MessageSender {
  id: string;
  name?: string;
  avatarUrl?: string;
}

export const mapMessage = (payload): Message => {
  console.log('camelcasekeys', {...camelcaseKeys(payload, {deep: true, stopPaths: ['content', 'metadata']})});
  return {
    ...camelcaseKeys(payload, {deep: true, stopPaths: ['content', 'metadata']}),
    sentAt: new Date(payload.sent_at),
  };
};

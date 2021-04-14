/* eslint-disable @typescript-eslint/no-var-requires */
const camelcaseKeys = require('camelcase-keys');
import {Content} from './Content';
import {Suggestions} from './SuggestedReply';

export enum MessageType {
  audio = 'audio',
  file = 'file',
  image = 'image',
  text = 'text',
  video = 'video',
}

export enum MessageState {
  pending = 'PENDING',
  failed = 'FAILED',
  delivered = 'DELIVERED',
}

export interface Message extends Content {
  deliveryState: MessageState;
  fromContact: boolean;
  sentAt: Date;
  metadata?: MessageMetadata;
}

export interface MessageMetadata {
  suggestions?: Suggestions;
}

export const mapMessage = (payload): Message => {
  return {
    ...camelcaseKeys(payload, {deep: true, stopPaths: ['content', 'metadata']}),
    sentAt: new Date(payload.sent_at),
  };
};

/* eslint-disable @typescript-eslint/no-var-requires */
const camelcaseKeys = require('camelcase-keys');
import {Content} from './Content';

export enum MessageType {
  audio = 'audio',
  file = 'file',
  image = 'image',
  text = 'text',
  video = 'video',
}

export enum MessageAlignment {
  left = 'LEFT',
  right = 'RIGHT',
  center = 'CENTER',
}

export enum MessageState {
  pending = 'PENDING',
  failed = 'FAILED',
  delivered = 'DELIVERED',
}

export enum SenderType {
  sourceContact = 'source_contact',
  sourceUser = 'source_user',
  appUser = 'app_user',
}

export interface Message extends Content {
  deliveryState: MessageState;
  senderType: SenderType;
  sentAt: Date;
  metadata?: MessageMetadata;
}

export interface SuggestedReply extends Content {}
export interface Suggestions {
  [suggestionId: string]: SuggestedReply;
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

/* eslint-disable @typescript-eslint/no-var-requires */
const camelcaseKeys = require('camelcase-keys');

export enum Source {
  facebook = 'facebook',
  google = 'google',
  chatplugin = 'chatplugin',
  smsTwilio = 'twilio.sms',
  whatsappTwilio = 'twilio.whatsapp',
}

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

export interface Message {
  id: string;
  content: any;
  deliveryState: MessageState;
  senderType: SenderType;
  sentAt: Date;
}

export const mapMessage = (payload): Message => {
  return {...camelcaseKeys(payload, {deep: true, stopPaths: ['content']}), sentAt: new Date(payload.sent_at)};
};

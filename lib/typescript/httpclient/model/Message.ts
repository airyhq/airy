import {MessagePayload} from '../payload/MessagePayload';

export interface Attachement {
  type: string;
  payload: {
    url?: string;
    title?: string;
    name?: string;
    templateType?: string;
    text?: string;
  };
  sender?: {
    id: string;
  };
}

export enum MessageSource {
  facebook = 'facebook',
  google = 'google',
  chatplugin = 'chat_plugin',
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

export function isFromContact(message: Message) {
  return message?.senderType === SenderType.sourceContact;
}

export interface Message {
  id: string;
  content: string;
  deliveryState: MessageState;
  senderType: SenderType;
  sentAt: Date;
}
export interface MessagePayloadData {
  data: MessagePayload[];
}

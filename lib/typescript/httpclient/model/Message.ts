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

export enum MessageType {
  text = 'text',
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
  content: {
    text: string;
  };
  deliveryState: MessageState;
  senderType: SenderType;
  sentAt: Date;
}
export interface MessagePayloadData {
  data: MessagePayload[];
}

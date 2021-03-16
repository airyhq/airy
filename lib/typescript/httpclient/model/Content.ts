import {Template} from './Template';
import {Message, SenderType} from './Message';

export interface Content {
  id: string;
  content: any;
}

export type RenderedContentUnion = Message | Template;

export function isFromContact(message: RenderedContentUnion) {
  if (message && 'senderType' in message) return message?.senderType === SenderType.sourceContact;
}

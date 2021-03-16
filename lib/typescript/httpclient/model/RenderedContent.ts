import {MessageState, SenderType} from './Message';

export interface RenderedContent {
  id: string;
  content: any;
  deliveryState?: MessageState;
  senderType?: SenderType;
  sentAt?: Date;
}

export function isFromContact(message: RenderedContent) {
  return message?.senderType === SenderType.sourceContact;
}

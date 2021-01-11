import {MessageType, MessageState, MessageSenderType} from '../model';

export interface MessagePayload {
  id: string;
  content: {
    text: string;
    type: MessageType;
  };
  delivery_state: MessageState;
  sender_type: MessageSenderType;
  sent_at: Date;
}

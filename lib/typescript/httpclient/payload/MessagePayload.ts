import {MessageType, MessageState, SenderType} from '../model';

export interface MessagePayload {
  id: string;
  content: {
    text: string;
    type: MessageType;
  };
  delivery_state: MessageState;
  sender_type: SenderType;
  sent_at: Date;
}

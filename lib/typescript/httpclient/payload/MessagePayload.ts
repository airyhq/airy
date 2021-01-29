import {MessageType, MessageState, SenderType} from '../model';

export interface MessagePayload {
  id: string;
  content: {
    text: {text: string};
  };
  delivery_state: MessageState;
  sender_type: SenderType;
  sent_at: Date;
}

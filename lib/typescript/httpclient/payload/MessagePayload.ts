import {MessageState, SenderType} from '../model';

export interface MessagePayload {
  id: string;
  content: string;
  delivery_state: MessageState;
  sender_type: SenderType;
  sent_at: Date;
  metadata?: Map<string,object>;
}

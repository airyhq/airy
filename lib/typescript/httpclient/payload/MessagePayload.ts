import {MessageType, MessageState, MessageAlignment} from '../model';

export interface MessagePayload {
  id: string;
  content: {
    text: string;
    type: MessageType;
  };
  state: MessageState;
  alignment: MessageAlignment;
  sent_at: string | Date;
}

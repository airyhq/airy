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

export interface Message {
  id: string;
  content: {
    text: string;
    type: MessageType;
  };
  state: MessageState;
  alignment: MessageAlignment;
  sentAt: string | Date;
}

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

export const messageMapper = (payload: MessagePayload): Message => {
  const message: Message = {
    id: payload.id,
    content: payload.content,
    state: payload.state,
    alignment: payload.alignment,
    sentAt: payload.sent_at,
  };
  return message;
};

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

export enum MessageSenderType {
  sourceContact = 'source_contact',
  sourceUser = 'source_user',
  appUser = 'app_user',
}
export interface Message {
  id: string;
  content: {
    text: string;
    type: MessageType;
  };
  deliveryState: MessageState;
  senderType: MessageSenderType;
  sentAt: Date;
}
export interface MessagePayloadData {
  data: Message[];
}
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

export const messageMapper = (payload: MessagePayload): Message => {
  const message: Message = {
    id: payload.id,
    content: payload.content,
    deliveryState: payload.delivery_state,
    senderType: payload.sender_type,
    sentAt: payload.sent_at,
  };
  return message;
};

export const messageMapperData = (payload: MessagePayloadData): Message[] => {
  const messages = [];
  payload.data.forEach((messagePayload: any) => {
    const message: Message = {
      id: messagePayload.id,
      content: messagePayload.content,
      deliveryState: messagePayload.delivery_state,
      senderType: messagePayload.sender_type,
      sentAt: messagePayload.sent_at,
    };
    messages.push(message);
  });
  return messages;
};
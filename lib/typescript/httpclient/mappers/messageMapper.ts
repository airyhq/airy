import {MessagePayload} from '../payload/MessagePayload';
import {Message} from '../model';

export const messageMapper = (payload: MessagePayload): Message => {
  const message: Message = {
    id: payload.id,
    content: payload.content,
    deliveryState: payload.delivery_state,
    senderType: payload.sender_type,
    sentAt: new Date(payload.sent_at),
  };
  return message;
};

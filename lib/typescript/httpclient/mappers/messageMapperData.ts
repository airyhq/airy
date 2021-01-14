import {MessagePayload} from '../payload/MessagePayload';
import {Message, MessagePayloadData} from '../model';

export const messageMapperData = (payload: MessagePayloadData): Message[] => {
  return payload.data.map((messagePayload: MessagePayload) => {
    const message: Message = {
      id: messagePayload.id,
      content: messagePayload.content,
      deliveryState: messagePayload.delivery_state,
      senderType: messagePayload.sender_type,
      sentAt: new Date(messagePayload.sent_at),
    };
    return message;
  });
};

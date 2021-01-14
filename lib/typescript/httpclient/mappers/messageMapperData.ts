import {MessagePayload} from '../payload/MessagePayload';
import {Message, MessagePayloadData} from '../model';
import {messageMapper} from './messageMapper';

export const messageMapperData = (payload: MessagePayloadData): Message[] => {
  return payload.data.map((messagePayload: MessagePayload) => messageMapper(messagePayload));
};

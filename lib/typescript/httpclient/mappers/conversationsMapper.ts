import {Conversation} from '../model';
import {ConversationPayload} from '../payload/ConversationPayload';
import {conversationMapper} from './conversationMapper';

export const conversationsMapper = (payloadArray: ConversationPayload[]): Conversation[] => {
  return (payloadArray || []).map(conversation => conversationMapper(conversation));
};

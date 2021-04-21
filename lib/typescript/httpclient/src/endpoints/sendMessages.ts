import {mapMessage} from 'model';

export const sendMessagesDef = {
  endpoint: 'messages.send',
  mapRequest: ({conversationId, message}) => ({conversation_id: conversationId, message}),
  mapResponse: mapMessage,
};

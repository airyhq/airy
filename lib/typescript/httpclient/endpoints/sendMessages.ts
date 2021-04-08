import {SendMessagesRequestPayload} from '../payload';
import {HttpClient} from '../client';
import {mapMessage} from 'model';

export default HttpClient.prototype.sendMessages = async function (requestPayload: SendMessagesRequestPayload) {
  const response = await this.doFetchFromBackend('messages.send', {
    conversation_id: requestPayload.conversationId,
    message: requestPayload.message,
  });

  return mapMessage(response);
};

import {SendMessagesRequestPayload, MessagePayload} from '../payload';
import {HttpClient} from '../client';

export default HttpClient.prototype.sendMessages = async function (requestPayload: SendMessagesRequestPayload) {
  const response: MessagePayload = await this.doFetchFromBackend('messages.send', {
    conversation_id: requestPayload.conversationId,
    message: requestPayload.message,
  });

  return this.mapMessage(response);
};

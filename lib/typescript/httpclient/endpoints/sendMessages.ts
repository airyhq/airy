import {SendMessagesRequestPayload, MessagePayload} from '../payload';
/* eslint-disable @typescript-eslint/no-var-requires */
const camelcaseKeys = require('camelcase-keys');
import {HttpClient} from '../client';

export default HttpClient.prototype.sendMessages = async function(requestPayload: SendMessagesRequestPayload) {
  const response: MessagePayload = await this.doFetchFromBackend('messages.send', {
    conversation_id: requestPayload.conversationId,
    message: requestPayload.message,
  });

  return this.mapMessage(response);
};

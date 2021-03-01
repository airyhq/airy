/* eslint-disable @typescript-eslint/no-var-requires */
import {HttpClient} from '../client';

export default HttpClient.prototype.readConversations = async function(conversationId: string) {
  await this.doFetchFromBackend('conversations.read', {conversation_id: conversationId});
  return Promise.resolve(true);
};

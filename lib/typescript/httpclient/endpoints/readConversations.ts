import {HttpClient} from '../client';

export default HttpClient.prototype.readConversations = function (conversationId: string) {
  return this.doFetchFromBackend('conversations.read', {conversation_id: conversationId});
};

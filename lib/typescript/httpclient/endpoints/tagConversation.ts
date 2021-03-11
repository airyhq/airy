import {TagConversationRequestPayload} from '../payload';
import {HttpClient} from '../client';

export default HttpClient.prototype.tagConversation = function (requestPayload: TagConversationRequestPayload) {
  return this.doFetchFromBackend('conversations.tag', {
    conversation_id: requestPayload.conversationId,
    tag_id: requestPayload.tagId,
  });
};

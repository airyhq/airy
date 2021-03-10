import {TagConversationRequestPayload} from '../payload';
import {HttpClient} from '../client';

export default HttpClient.prototype.tagConversation = async function (requestPayload: TagConversationRequestPayload) {
  await this.doFetchFromBackend('conversations.tag', {
    conversation_id: requestPayload.conversationId,
    tag_id: requestPayload.tagId,
  });
  return Promise.resolve(true);
};

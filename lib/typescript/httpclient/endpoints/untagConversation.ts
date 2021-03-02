import {UntagConversationRequestPayload} from '../payload';
import {HttpClient} from '../client';

export default HttpClient.prototype.untagConversation = async function untagConversation(
  requestPayload: UntagConversationRequestPayload
) {
  await this.doFetchFromBackend('conversations.untag', {
    conversation_id: requestPayload.conversationId,
    tag_id: requestPayload.tagId,
  });
  return Promise.resolve(true);
};

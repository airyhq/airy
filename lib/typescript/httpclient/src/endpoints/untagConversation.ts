import {UntagConversationRequestPayload} from './payload';
import {HttpClient} from '../../client';

export default HttpClient.prototype.untagConversation = function untagConversation(
  requestPayload: UntagConversationRequestPayload
) {
  return this.doFetchFromBackend('conversations.untag', {
    conversation_id: requestPayload.conversationId,
    tag_id: requestPayload.tagId,
  });
};

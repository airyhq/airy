import {UntagConversationRequestPayload} from '../payload';
/* eslint-disable @typescript-eslint/no-var-requires */
const camelcaseKeys = require('camelcase-keys');
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

import {TagConversationRequestPayload} from '../payload';
/* eslint-disable @typescript-eslint/no-var-requires */
const camelcaseKeys = require('camelcase-keys');
import {HttpClient} from '../client';

export default HttpClient.prototype.tagConversation = async function(requestPayload: TagConversationRequestPayload) {
  await this.doFetchFromBackend('conversations.tag', {
    conversation_id: requestPayload.conversationId,
    tag_id: requestPayload.tagId,
  });
  return Promise.resolve(true);
};

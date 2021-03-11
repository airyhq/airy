/* eslint-disable @typescript-eslint/no-var-requires */
const camelcaseKeys = require('camelcase-keys');
import {HttpClient} from '../client';

export default HttpClient.prototype.getConversationInfo = async function (conversationId: string) {
  const response = await this.doFetchFromBackend('conversations.info', {
    conversation_id: conversationId,
  });

  return camelcaseKeys(response, {deep: true, stopPaths: ['metadata.userData']});
};

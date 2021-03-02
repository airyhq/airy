import {PaginatedPayload, ConversationPayload, ListConversationsRequestPayload} from '../payload';
/* eslint-disable @typescript-eslint/no-var-requires */
const camelcaseKeys = require('camelcase-keys');
import {HttpClient} from '../client';

export default HttpClient.prototype.listConversations = async function(
  conversationListRequest: ListConversationsRequestPayload
) {
  conversationListRequest.page_size = conversationListRequest.page_size ?? 10;
  conversationListRequest.cursor = conversationListRequest.cursor ?? null;
  const response: PaginatedPayload<ConversationPayload> = await this.doFetchFromBackend(
    'conversations.list',
    conversationListRequest
  );

  const conversationData = response.data.map((messagePayload: ConversationPayload) => ({
    ...camelcaseKeys(messagePayload, {deep: true, stopPaths: ['metadata.userData']}),
    createdAt: new Date(messagePayload.created_at),
    lastMessage: this.mapMessage(messagePayload.last_message),
  }));

  return {
    data: conversationData,
    paginationData: camelcaseKeys(response.pagination_data),
  };
};

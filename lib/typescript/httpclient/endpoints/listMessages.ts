import {ListMessagesRequestPayload, PaginatedPayload, MessagePayload} from '../payload';
/* eslint-disable @typescript-eslint/no-var-requires */
const camelcaseKeys = require('camelcase-keys');
import {HttpClient} from '../client';

export default HttpClient.prototype.listMessages = async function(conversationListRequest: ListMessagesRequestPayload) {
  conversationListRequest.pageSize = conversationListRequest.pageSize ?? 10;
  conversationListRequest.cursor = conversationListRequest.cursor ?? null;

  const response: PaginatedPayload<MessagePayload> = await this.doFetchFromBackend('messages.list', {
    conversation_id: conversationListRequest.conversationId,
    cursor: conversationListRequest.cursor,
    page_size: conversationListRequest.pageSize,
  });

  const mappedMessageData = response.data.map((messagePayload: MessagePayload) => this.mapMessage(messagePayload));

  return {data: mappedMessageData, paginationData: camelcaseKeys(response.pagination_data)};
};

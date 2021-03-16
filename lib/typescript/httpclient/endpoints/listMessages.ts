import {ListMessagesRequestPayload, PaginatedPayload} from '../payload';
import {HttpClient} from '../client';
import {mapMessage} from '../model';

/* eslint-disable @typescript-eslint/no-var-requires */
const camelcaseKeys = require('camelcase-keys');

export default HttpClient.prototype.listMessages = async function (
  conversationListRequest: ListMessagesRequestPayload
) {
  conversationListRequest.pageSize = conversationListRequest.pageSize ?? 10;
  conversationListRequest.cursor = conversationListRequest.cursor ?? null;

  const response: PaginatedPayload<any> = await this.doFetchFromBackend('messages.list', {
    conversation_id: conversationListRequest.conversationId,
    cursor: conversationListRequest.cursor,
    page_size: conversationListRequest.pageSize,
  });

  const mappedMessageData = response.data.map(messagePayload => mapMessage(messagePayload));

  return {data: mappedMessageData, paginationData: camelcaseKeys(response.pagination_data)};
};

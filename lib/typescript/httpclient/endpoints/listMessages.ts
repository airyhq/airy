import {doFetchFromBackend} from '../api';
import {ListMessagesRequestPayload} from '../payload/ListMessagesRequestPayload';
import {MessagePayload} from '../payload/MessagePayload';
import {PaginatedPayload} from '../payload/PaginatedPayload';
import {messageMapperData} from '../mappers/messageMapperData';

export function listMessages(conversationListRequest: ListMessagesRequestPayload) {
  conversationListRequest.pageSize = conversationListRequest.pageSize ?? 10;
  conversationListRequest.cursor = conversationListRequest.cursor ?? null;

  return doFetchFromBackend('messages.list', {
    conversation_id: conversationListRequest.conversationId,
    cursor: conversationListRequest.cursor,
    page_size: conversationListRequest.pageSize,
  })
    .then((response: PaginatedPayload<MessagePayload>) => {
      const {responseMetadata} = response;
      return {data: messageMapperData(response), metadata: responseMetadata};
    })
    .catch((error: Error) => {
      return error;
    });
}

import {doFetchFromBackend} from '../api';
import {messageMapperData} from '../model';
import {ListMessagesRequestPayload} from '../payload/ListMessagesRequestPayload';
import {MessagePayload} from '../payload/MessagePayload';
import {PaginatedPayload} from '../payload/PaginatedPayload';

export function listMessages(conversationListRequest: ListMessagesRequestPayload) {
  conversationListRequest.page_size = conversationListRequest.page_size ?? 10;
  conversationListRequest.cursor = conversationListRequest.cursor ?? null;

  return doFetchFromBackend('messages.list', conversationListRequest)
    .then((response: PaginatedPayload<MessagePayload>) => {
      const {responseMetadata} = response;
      return {data: messageMapperData(response), metadata: responseMetadata};
    })
    .catch((error: Error) => {
      return error;
    });
}

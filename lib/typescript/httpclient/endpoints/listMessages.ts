import {doFetchFromBackend} from '../api';
import {Message, MessagePayloadData} from '../model';
import {ListMessagesRequestPayload} from '../payload/ListMessagesRequestPayload';
import {MessagePayload} from '../payload/MessagePayload';
import {PaginatedPayload} from '../payload/PaginatedPayload';

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

const messageMapperData = (payload: MessagePayloadData): Message[] => {
  return payload.data.map((messagePayload: MessagePayload) => {
    const message: Message = {
      id: messagePayload.id,
      content: messagePayload.content,
      deliveryState: messagePayload.delivery_state,
      senderType: messagePayload.sender_type,
      sentAt: messagePayload.sent_at,
    };
    return message;
  });
};

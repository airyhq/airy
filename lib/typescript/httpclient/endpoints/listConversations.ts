import {doFetchFromBackend} from '../api';
import {ListConversationsRequestPayload} from '../payload';
import {Conversation, Message} from '../model';
import {ConversationPayload} from '../payload/ConversationPayload';
import {MessagePayload} from '../payload/MessagePayload';
import {PaginatedPayload} from '../payload/PaginatedPayload';

const messageMapper = (payload: MessagePayload): Message => {
  const message: Message = {
    id: payload.id,
    content: payload.content,
    deliveryState: payload.delivery_state,
    senderType: payload.sender_type,
    sentAt: new Date(payload.sent_at),
  };
  return message;
};

const conversationMapper = (payload: ConversationPayload): Conversation => {
  const conversation: Conversation = {
    id: payload.id,
    channel: payload.channel,
    createdAt: payload.created_at,
    contact: {
      avatarUrl: payload.contact.avatar_url,
      firstName: payload.contact.first_name,
      lastName: payload.contact.last_name,
      displayName: payload.contact.first_name + ' ' + payload.contact.last_name,
      id: payload.contact.id,
    },
    tags: payload.tags,
    lastMessage: messageMapper(payload.last_message),
    unreadMessageCount: payload.unread_message_count,
  };
  return conversation;
};

const conversationsMapper = (payloadArray: ConversationPayload[]): Conversation[] => {
  return (payloadArray || []).map(conversation => conversationMapper(conversation));
};

export function listConversations(conversationListRequest: ListConversationsRequestPayload) {
  conversationListRequest.page_size = conversationListRequest.page_size ?? 10;
  conversationListRequest.cursor = conversationListRequest.cursor ?? null;

  return doFetchFromBackend('conversations.list', conversationListRequest)
    .then((response: PaginatedPayload<ConversationPayload>) => {
      const {responseMetadata} = response;
      return {data: conversationsMapper(response.data), metadata: responseMetadata};
    })
    .catch((error: Error) => {
      return error;
    });
}

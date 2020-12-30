import {doFetchFromBackend} from '../api';
import {FetchConversationsResponse, ConversationPayload, MessagePayload} from '../payload';
import {Conversation, Message} from '../model';

export function fetchNextConversations(cursor: string, page_size?: number) {
  const messageMapper = (payload: MessagePayload): Message => {
    const message: Message = {
      id: payload.id,
      content: payload.content,
      state: payload.state,
      alignment: payload.alignment,
      sentAt: payload.sent_at,
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
    const conversations: Conversation[] = [];
    payloadArray.forEach((conversation: ConversationPayload) => {
      conversations.push(conversationMapper(conversation));
    });
    return conversations;
  };

  return doFetchFromBackend('conversations.list', {
    cursor,
    page_size: page_size ?? 10,
  })
    .then((response: FetchConversationsResponse) => {
      const {response_metadata} = response;
      return {data: conversationsMapper(response.data), metadata: response_metadata};
    })
    .catch((error: Error) => {
      return error;
    });
}

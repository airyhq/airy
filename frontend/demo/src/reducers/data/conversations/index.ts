import {ActionType, getType} from 'typesafe-actions';
import {combineReducers} from 'redux';
import {cloneDeep, uniq} from 'lodash-es';

import {Conversation, Message} from 'httpclient';
import * as actions from '../../../actions/conversations';

type Action = ActionType<typeof actions>;

type MergedConversation = Conversation & {
  blocked?: boolean;
  paginationData?: {
    previousCursor: string;
    nextCursor: string;
    total: number;
    loading: boolean;
  };
};

export type AllConversationPaginationData = {
  previousCursor: string;
  nextCursor: string;
  total: number;
  loading?: boolean;
  loaded?: boolean;
  filtered_total?: number;
};

export type ConversationMap = {
  [conversationId: string]: MergedConversation;
};

export type AllConversationsState = {
  items: ConversationMap;
  paginationData: AllConversationPaginationData;
};

export type ErrorState = {
  [conversationId: string]: string;
};

export type ConversationsState = {
  all: AllConversationsState;
  errors: ErrorState;
};

function mergeConversations(
  oldConversation: {[conversation_id: string]: MergedConversation},
  newConversations: MergedConversation[]
): ConversationMap {
  newConversations.forEach((conversation: MergedConversation) => {
    if (conversation.lastMessage) {
      conversation.lastMessage.sentAt = new Date(conversation.lastMessage.sentAt);
    }
  });

  const conversations = cloneDeep(oldConversation);

  newConversations.forEach((conversation: MergedConversation) => {
    if (conversations[conversation.id] && conversations[conversation.id].paginationData) {
      conversations[conversation.id] = {
        ...newConversations[conversation.id],
        ...conversation,
        message: getLatestMessage(newConversations[conversation.id], conversation),
        paginationData: conversations[conversation.id].paginationData,
      };
    } else {
      conversations[conversation.id] = {
        ...newConversations[conversation.id],
        ...conversation,
        message: getLatestMessage(newConversations[conversation.id], conversation),
      };
    }
  });

  return conversations;
}

function getLatestMessage(oldConversation: Conversation, conversation: Conversation): Message {
  return ((conversation && conversation.lastMessage && new Date(conversation.lastMessage.sentAt).getTime()) || 1) >
    ((oldConversation && oldConversation.lastMessage && new Date(oldConversation.lastMessage.sentAt).getTime()) || 0)
    ? conversation.lastMessage
    : oldConversation.lastMessage;
}

function setLoadingOfConversation(items: ConversationMap, conversationId: string, isLoading: boolean): ConversationMap {
  if (items[conversationId]) {
    return {
      ...items,
      [conversationId]: {
        ...items[conversationId],
        paginationData: {
          ...items[conversationId].paginationData,
          loading: isLoading,
        },
      },
    };
  }
  return items;
}

const initialState: AllConversationsState = {
  items: {},
  paginationData: {
    loading: false,
    loaded: false,
    previousCursor: null,
    nextCursor: null,
    total: 0,
    filtered_total: 0,
  },
};

const addTagToConversation = (state: AllConversationsState, conversationId, tagId) => {
  const conversation: Conversation = state.items[conversationId];
  if (conversation) {
    const tags: string[] = [...state.items[conversationId].tags];
    tags.push(tagId);

    return {
      ...state,
      items: {
        ...state.items,
        [conversation.id]: {
          ...conversation,
          tags: uniq(tags),
        },
      },
    };
  }

  return state;
};

const removeTagFromConversation = (state: AllConversationsState, conversationId, tagId) => {
  const conversation: Conversation = state.items[conversationId];
  if (conversation) {
    return {
      ...state,
      items: {
        ...state.items,
        [conversation.id]: {
          ...conversation,
          tags: conversation.tags.filter(tag => tag !== tagId),
        },
      },
    };
  }

  return state;
};

function allReducer(state: AllConversationsState = initialState, action: Action): AllConversationsState {
  switch (action.type) {
    case getType(actions.mergeConversationsAction):
      return {
        ...state,
        items: mergeConversations(state.items, action.payload.conversations.data as MergedConversation[]),
        paginationData: {
          ...state.paginationData,
          ...action.payload.conversations.paginationData,
          loading: false,
          loaded: true,
        },
      };

    case getType(actions.loadingConversationsAction):
      return {
        ...state,
        paginationData: {
          ...state.paginationData,
          loading: true,
        },
      };

    case getType(actions.loadingConversationAction):
      return {
        ...state,
        items: setLoadingOfConversation(state.items, action.payload, true),
        paginationData: {
          ...state.paginationData,
          loading: true,
        },
      };

    case getType(actions.readConversationsAction):
      return {
        ...state,
        items: {
          ...state.items,
          [action.payload.conversationId]: {
            ...state.items[action.payload.conversationId],
            unreadMessageCount: 0,
          },
        },
        paginationData: {
          ...state.paginationData,
          loading: false,
        },
      };

    case getType(actions.addTagToConversationAction):
      return addTagToConversation(state, action.payload.conversationId, action.payload.tagId);

    case getType(actions.removeTagFromConversationAction):
      return removeTagFromConversation(state, action.payload.conversationId, action.payload.tagId);

    case getType(actions.updateMessagesPaginationDataAction):
      if (state.items[action.payload.conversationId]) {
        return {
          ...state,
          items: {
            ...state.items,
            [action.payload.conversationId]: {
              ...state.items[action.payload.conversationId],
              paginationData: {
                ...state.items[action.payload.conversationId].paginationData,
                ...action.payload.paginationData,
                loading: false,
              },
            },
          },
        };
      }
      return state;

    default:
      return state;
  }
}

function errorsReducer(state: ErrorState = {}, action: Action): ErrorState {
  switch (action.type) {
    case getType(actions.addErrorToConversationAction):
      return {
        ...state,
        [action.payload.conversationId]: action.payload.errorMessage,
      };
    case getType(actions.removeErrorFromConversationAction):
      return {
        ...state,
        [action.payload.conversationId]: null,
      };
    default:
      return state;
  }
}

export default combineReducers({
  all: allReducer,
  errors: errorsReducer,
});

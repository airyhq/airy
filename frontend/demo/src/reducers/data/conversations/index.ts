import {ActionType, getType} from 'typesafe-actions';
import {combineReducers} from 'redux';
import {cloneDeep, uniq, sortBy} from 'lodash-es';

import {Conversation, Message, ConversationFilter, ResponseMetadataPayload} from 'httpclient';

import * as actions from '../../../actions/conversations';
import * as filterActions from '../../../actions/conversationsFilter';
import * as messageActions from '../../../actions/messages';

type Action = ActionType<typeof actions>;
type FilterAction = ActionType<typeof filterActions>;
type MessageAction = ActionType<typeof messageActions>;

type MergedConversation = Conversation & {
  blocked?: boolean;
  metadata?: ResponseMetadataPayload & {
    loading: boolean;
  };
};

export type AllConversationMetadata = ResponseMetadataPayload & {
  loading?: boolean;
  loaded?: boolean;
  filtered_total?: number;
};

export type ConversationMap = {
  [conversationId: string]: MergedConversation;
};

export type AllConversationsState = {
  items: ConversationMap;
  metadata: AllConversationMetadata;
};

export type FilteredState = {
  items: ConversationMap;
  currentFilter: ConversationFilter;
  metadata: AllConversationMetadata;
};

export type ErrorState = {
  [conversationId: string]: string;
};

export type ConversationsState = {
  all?: AllConversationsState;
  filtered?: FilteredState;
  errors?: ErrorState;
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
    if (conversations[conversation.id] && conversations[conversation.id].metadata) {
      conversations[conversation.id] = {
        ...newConversations[conversation.id],
        ...conversation,
        message: getLatestMessage(newConversations[conversation.id], conversation),
        metadata: conversations[conversation.id].metadata,
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

function mergeFilteredConversations(
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
    conversations[conversation.id] = {
      ...newConversations[conversation.id],
      ...conversation,
      message: getLatestMessage(newConversations[conversation.id], conversation),
    };
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
        metadata: {
          ...items[conversationId].metadata,
          loading: isLoading,
        },
      },
    };
  }
  return items;
}

const initialState: AllConversationsState = {
  items: {},
  metadata: {
    loading: false,
    loaded: false,
    previous_cursor: null,
    next_cursor: null,
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

const lastMessageOf = (messages: Message[]): Message => {
  return sortBy(messages, message => message.sentAt).pop();
};

const mergeMessages = (state: AllConversationsState, conversationId: string, messages: Message[]) => {
  const conversation: Conversation = state.items[conversationId];
  if (conversation) {
    return {
      ...state,
      items: {
        ...state.items,
        [conversation.id]: {
          ...conversation,
          lastMessage: lastMessageOf(messages.concat([conversation.lastMessage])),
        },
      },
    };
  }
  return state;
};

function allReducer(
  state: AllConversationsState = initialState,
  action: Action | MessageAction
): AllConversationsState {
  switch (action.type) {
    case getType(actions.mergeConversationsAction):
      return {
        ...state,
        items: mergeConversations(state.items, action.payload.conversations as MergedConversation[]),
        metadata: {...state.metadata, ...action.payload.responseMetadata, loading: false, loaded: true},
      };

    case getType(actions.loadingConversationsAction):
      return {
        ...state,
        metadata: {
          ...state.metadata,
          loading: true,
        },
      };

    case getType(actions.loadingConversationAction):
      return {
        ...state,
        items: setLoadingOfConversation(state.items, action.payload, true),
        metadata: {
          ...state.metadata,
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
        metadata: {
          ...state.metadata,
          loading: false,
        },
      };

    case getType(actions.addTagToConversationAction):
      return addTagToConversation(state, action.payload.conversationId, action.payload.tagId);

    case getType(actions.removeTagFromConversationAction):
      return removeTagFromConversation(state, action.payload.conversationId, action.payload.tagId);

    case getType(actions.updateMessagesMetadataAction):
      if (state.items[action.payload.conversationId]) {
        return {
          ...state,
          items: {
            ...state.items,
            [action.payload.conversationId]: {
              ...state.items[action.payload.conversationId],
              metadata: {
                ...state.items[action.payload.conversationId].metadata,
                ...action.payload.metadata,
                loading: false,
              },
            },
          },
        };
      }
      return state;

    case getType(actions.setConversationUnreadMessageCount):
      return {
        ...state,
        items: {
          ...state.items,
          [action.payload.conversationId]: {
            ...state.items[action.payload.conversationId],
            unreadMessageCount: action.payload.unreadMessageCount,
          },
        },
      };

    case getType(messageActions.addMessagesAction):
      return mergeMessages(state, action.payload.conversationId, action.payload.messages);

    case getType(messageActions.loadingMessagesAction):
      return mergeMessages(state, action.payload.conversationId, action.payload.messages);

    default:
      return state;
  }
}

function filteredReducer(
  state: FilteredState = {
    items: {},
    metadata: {previous_cursor: null, next_cursor: null, total: 0},
    currentFilter: {},
  },
  action: FilterAction | Action
): FilteredState {
  switch (action.type) {
    case getType(filterActions.setFilteredConversationsAction):
      return {
        currentFilter: action.payload.filter,
        items: mergeConversations({}, action.payload.conversations),
        metadata: action.payload.metadata,
      };
    case getType(filterActions.mergeFilteredConversationsAction):
      return {
        currentFilter: action.payload.filter,
        items: mergeFilteredConversations(state.items, action.payload.conversations),
        metadata: action.payload.metadata,
      };
    case getType(filterActions.resetFilteredConversationAction):
      return {items: {}, metadata: {previous_cursor: null, next_cursor: null, total: 0}, currentFilter: {}};
    case getType(filterActions.updateFilteredConversationsAction):
      return {
        ...state,
        currentFilter: action.payload.filter,
      };
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
  filtered: filteredReducer,
  errors: errorsReducer,
});

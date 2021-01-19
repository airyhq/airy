import {ActionType, getType} from 'typesafe-actions';
import {combineReducers} from 'redux';
import {cloneDeep} from 'lodash-es';

import {Conversation, Message, ConversationFilter, ResponseMetadataPayload} from 'httpclient';

import * as actions from '../../../actions/conversations';
import * as filterActions from '../../../actions/conversationsFilter';


type Action = ActionType<typeof actions>;
type FilterAction = ActionType<typeof filterActions>;

type MergedConversation = Conversation & {
  blocked?: boolean;
  metadata?: ResponseMetadataPayload & {
    loading: boolean;
  };
};

export type AllConversationMetadata = ResponseMetadataPayload & {
  loading?: boolean;
  loaded?: boolean;
  filteredTotal?: number;
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
    if (conversation.contact && !conversation.contact.displayName) {
      conversation.contact.displayName = `${conversation.contact.firstName} ${conversation.contact.lastName}`;
    }
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
    previousCursor: null,
    nextCursor: null,
    total: 0,
    filteredTotal: 0,
  },
};

function allReducer(state: AllConversationsState = initialState, action: Action): AllConversationsState {
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
      };

    default:
      return state;
  }
}

function filteredReducer(
  state: FilteredState = {
    items: {},
    metadata: {previousCursor: null, nextCursor: null, total: 0},
    currentFilter: {},
  },
  action: FilterAction | Action
): FilteredState {
  switch (action.type) {
    // case getType(filterActions.setFilteredConversationsAction):
    //   return {
    //     currentFilter: action.payload.filter,
    //     items: mergeConversations({}, action.payload.conversations),
    //     metadata: action.payload.metadata,
    //   };
    case getType(filterActions.mergeFilteredConversationsAction):
      return {
        currentFilter: action.payload.filter,
        items: mergeConversations(state.items, action.payload.conversations),
        metadata: action.payload.metadata,
      };
    case getType(filterActions.resetFilteredConversationAction):
      return {items: {}, metadata: {previousCursor: null, nextCursor: null, total: 0}, currentFilter: {}};
    case getType(filterActions.updateFilteredConversationsAction):
      return {
        ...state,
        currentFilter: action.payload.filter,
      };
    // case getType(filterActions.loadingFilteredConversationsAction):
    //   return {
    //     ...state,
    //     metadata: {
    //       ...state.metadata,
    //       loading: true,
    //     },
    //   };

    // case getType(actions.updateConversationStateAction):
    //   if (!state.items[action.payload.conversationId]) {
    //     return state;
    //   }
    //   return {
    //     ...state,
    //     items: {
    //       ...state.items,
    //       [action.payload.conversationId]: {
    //         ...state.items[action.payload.conversationId],
    //         state: action.payload.state,
    //       },
    //     },
    //   };

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

import {ActionType, getType} from 'typesafe-actions';
import {combineReducers} from 'redux';
import {cloneDeep} from 'lodash-es';

import {ResponseMetadata} from '../../../model/ResponseMetadata';
import {Conversation} from '../../../model/Conversation';
import * as actions from '../../../actions/conversations';
import {Message} from '../../../model/Message';

type Action = ActionType<typeof actions>;

type MergedConversation = Conversation & {
  blocked?: boolean;
  metadata?: ResponseMetadata & {
    loading: boolean;
  };
};

export type AllConversationMetadata = ResponseMetadata & {
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
    previous_cursor: null,
    next_cursor: null,
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

import {ActionType, getType} from 'typesafe-actions';
import {combineReducers} from 'redux';
import {cloneDeep} from 'lodash-es';

import {ResponseMetadata} from '../../../model/ResponseMetadata';
import {Conversation} from '../../../model/Conversation';
import * as actions from '../../../actions/conversations';

type Action = ActionType<typeof actions>;

type MergedConversation = Conversation & {
  blocked?: boolean;
  unread_message_count?: number;
  metadata: ResponseMetadata & {
    loading: boolean;
  };
};

export type AllConversationMetadata = ResponseMetadata & {
  loading?: boolean;
  loaded?: boolean;
  filtered_total?: number;
  badge_unread_count?: number;
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
  oldConversation: {[conversation_id: string]: Conversation},
  newConversations: Conversation[]
) {
  newConversations.forEach(conversation => {
    if (conversation.contact) {
      if (!conversation.contact.display_name) {
        conversation.contact.display_name = `${conversation.contact.first_name} ${conversation.contact.last_name}`;
      }
    }

    if (conversation.message) {
      conversation.message.sent_at = new Date(conversation.message.sent_at);
    }
  });

  const conversations = cloneDeep(oldConversation);
  newConversations.forEach(conversation => {
    conversations[conversation.id] = {
      ...newConversations[conversation.id],
      ...conversation,
      message: getLatestMessage(newConversations[conversation.id], conversation),
    };
  });

  return conversations;
}

function getLatestMessage(oldConversation: Conversation, conversation: Conversation) {
  return ((conversation && conversation.message && new Date(conversation.message.sent_at).getTime()) || 1) >
    ((oldConversation && oldConversation.message && new Date(oldConversation.message.sent_at).getTime()) || 0)
    ? conversation.message
    : oldConversation.message;
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
    badge_unread_count: 0,
  },
};

function allReducer(state: AllConversationsState = initialState, action: Action): AllConversationsState {
  switch (action.type) {
    case getType(actions.mergeConversationsAction):
      return {
        ...state,
        items: mergeConversations(state.items, action.payload.conversations),
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

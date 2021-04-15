import {ActionType, getType} from 'typesafe-actions';
import {combineReducers} from 'redux';
import {cloneDeep, sortBy, merge, pickBy} from 'lodash-es';

import {Conversation, ConversationFilter, Message} from 'model';

import * as metadataActions from '../../../actions/metadata';
import * as actions from '../../../actions/conversations';
import * as filterActions from '../../../actions/conversationsFilter';
import * as messageActions from '../../../actions/messages';
import {MetadataEvent, ConversationMetadata} from 'model';

type Action = ActionType<typeof actions> | ActionType<typeof metadataActions>;
type FilterAction = ActionType<typeof filterActions>;
type MessageAction = ActionType<typeof messageActions>;

export type MergedConversation = Conversation & {
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
  filteredTotal?: number;
};

export type ConversationMap = {
  [conversationId: string]: MergedConversation;
};

export type AllConversationsState = {
  items: ConversationMap;
  paginationData: AllConversationPaginationData;
};

export type FilteredState = {
  items: ConversationMap;
  currentFilter: ConversationFilter;
  paginationData: AllConversationPaginationData;
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
    if (conversations[conversation.id] && conversations[conversation.id].paginationData) {
      conversations[conversation.id] = {
        ...newConversations[conversation.id],
        ...conversation,
        lastMessage: getLatestMessage(newConversations[conversation.id], conversation),
        paginationData: conversations[conversation.id].paginationData,
      };
    } else {
      conversations[conversation.id] = {
        ...newConversations[conversation.id],
        ...conversation,
        lastMessage: getLatestMessage(newConversations[conversation.id], conversation),
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
      lastMessage: getLatestMessage(newConversations[conversation.id], conversation),
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
    filteredTotal: 0,
  },
};

const removeTagFromConversation = (state: AllConversationsState, conversationId, tagId) => {
  const conversation: Conversation = state.items[conversationId];
  if (!conversation) {
    return state;
  }

  return {
    ...state,
    items: {
      ...state.items,
      [conversation.id]: {
        ...conversation,
        metadata: {
          ...conversation.metadata,
          tags: pickBy(conversation.metadata?.tags, (value, key) => key !== tagId),
        },
      },
    },
  };
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
    case getType(metadataActions.setMetadataAction):
      if (action.payload.subject !== 'conversation') {
        return state;
      }

      return {
        ...state,
        items: {
          ...state.items,
          [action.payload.identifier]: {
            id: action.payload.identifier,
            ...state.items[action.payload.identifier],
            metadata: {
              // Ensure that there is always a display name present
              ...(action.payload as MetadataEvent<ConversationMetadata>).metadata,
              contact: {
                ...state.items[action.payload.identifier]?.metadata.contact,
                ...(action.payload as MetadataEvent<ConversationMetadata>).metadata.contact,
              },
              state: action.payload.metadata.state,
            },
          },
        },
      };

    case getType(metadataActions.mergeMetadataAction):
      if (action.payload.subject !== 'conversation') {
        return state;
      }

      return {
        ...state,
        items: {
          ...state.items,
          [action.payload.identifier]: {
            id: action.payload.identifier,
            ...state.items[action.payload.identifier],
            metadata: merge({}, state.items[action.payload.identifier]?.metadata, action.payload.metadata),
          },
        },
      };
    case getType(actions.mergeConversationsAction):
      if (action.payload.paginationData) {
        return {
          ...state,
          items: mergeConversations(state.items, action.payload.conversations as MergedConversation[]),
          paginationData: {
            ...state.paginationData,
            ...action.payload.paginationData,
            loading: false,
            loaded: true,
          },
        };
      } else {
        return {
          ...state,
          items: mergeConversations(state.items, action.payload.conversations as MergedConversation[]),
          paginationData: {
            ...state.paginationData,
            loading: false,
            loaded: true,
          },
        };
      }

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
    paginationData: {previousCursor: null, nextCursor: null, total: 0},
    currentFilter: {},
  },
  action: FilterAction | Action
): FilteredState {
  switch (action.type) {
    case getType(filterActions.setFilteredConversationsAction):
      return {
        currentFilter: action.payload.filter,
        items: mergeConversations({}, action.payload.conversations),
        paginationData: action.payload.paginationData,
      };
    case getType(filterActions.mergeFilteredConversationsAction):
      return {
        currentFilter: action.payload.filter,
        items: mergeFilteredConversations(state.items, action.payload.conversations),
        paginationData: action.payload.paginationData,
      };
    case getType(filterActions.resetFilteredConversationAction):
      return {items: {}, paginationData: {previousCursor: null, nextCursor: null, total: 0}, currentFilter: {}};
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

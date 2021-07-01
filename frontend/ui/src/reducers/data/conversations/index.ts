import {ActionType, getType} from 'typesafe-actions';
import {combineReducers} from 'redux';
import {cloneDeep, sortBy, merge, pickBy} from 'lodash-es';

import {Conversation, Message} from 'model';
import conversationFilteredReducer, {ConversationFilteredState} from '../conversationsFilter';

import * as metadataActions from '../../../actions/metadata';
import * as actions from '../../../actions/conversations';
import * as messageActions from '../../../actions/messages';

type Action = ActionType<typeof actions> | ActionType<typeof metadataActions>;
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
  all?: AllConversationsState;
  filtered?: ConversationFilteredState;
  errors?: ErrorState;
};

const initialState: AllConversationsState = {
  items: {},
  paginationData: {
    loading: false,
    loaded: false,
    previousCursor: null,
    nextCursor: null,
    total: 0,
  },
};

export function mergeConversations(
  oldConversation: {[conversationId: string]: MergedConversation},
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

export function getLatestMessage(oldConversation: Conversation, conversation: Conversation): Message {
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

const lastMessageOf = (messages: Message[]): Message => {
  return sortBy(messages, message => message.sentAt).pop();
};

const updateContact = (state: AllConversationsState, conversationId: string, displayName: string) => {
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
          contact: {
            ...conversation.metadata.contact,
            displayName: displayName,
          },
        },
      },
    },
  };
};

const removeTagFromConversation = (state: AllConversationsState, conversationId: string, tagId: string) => {
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
          tags: pickBy(conversation.metadata?.tags, (_, key) => key !== tagId),
        },
      },
    },
  };
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
  let updatedConversationCount = state.paginationData.total;

  switch (action.type) {
    case getType(actions.setStateConversationAction):
      return {
        ...state,
        items: {
          ...state.items,
          [action.payload.conversationId]: {
            id: action.payload.conversationId,
            ...state.items[action.payload.conversationId],
            metadata: {
              ...state.items[action.payload.conversationId].metadata,
              state: action.payload.state,
            },
          },
        },
      };

    case getType(metadataActions.setMetadataAction):
      if (action.payload.subject !== 'conversation' || !state.items[action.payload.identifier]) {
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

    case getType(actions.updateContactAction): {
      return updateContact(state, action.payload.conversationId, action.payload.displayName);
    }
    case getType(actions.mergeConversationsAction):
      action.payload.conversations.forEach(conversation => {
        if (!state.items[conversation.id]) updatedConversationCount++;
      });

      if (action.payload.paginationData) {
        return {
          ...state,
          items: mergeConversations(state.items, action.payload.conversations as MergedConversation[]),
          paginationData: {
            ...state.paginationData,
            ...action.payload.paginationData,
            ...(state.paginationData.total < updatedConversationCount &&
              action.payload.paginationData.total < updatedConversationCount && {total: updatedConversationCount}),
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
            ...(state.paginationData.total < updatedConversationCount && {total: updatedConversationCount}),
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
          loading: action.payload,
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
  filtered: conversationFilteredReducer,
  errors: errorsReducer,
});

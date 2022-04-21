import {ActionType, getType} from 'typesafe-actions';
import {merge, pickBy, cloneDeep} from 'lodash-es';
import {Conversation} from 'model';
import {
  ConversationMap,
  AllConversationPaginationData,
  mergeConversations,
  MergedConversation,
  getLatestMessage,
} from '../conversations';

import * as metadataActions from '../../../actions/metadata';
import * as actions from '../../../actions/conversations';
import * as filterActions from '../../../actions/conversationsFilter';

type Action = ActionType<typeof actions> | ActionType<typeof metadataActions>;
type FilterAction = ActionType<typeof filterActions>;

export type ConversationFilteredState = {
  items: ConversationMap;
  currentFilter: ConversationFilter;
  paginationData: AllConversationPaginationData;
};

export interface ConversationFilter {
  readOnly?: boolean;
  unreadOnly?: boolean;
  displayName?: string;
  createdAt?: string;
  byTags?: string[];
  byChannels?: string[];
  bySources?: string[];
  isStateOpen?: boolean;
}

function mergeFilteredConversations(
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
    conversations[conversation.id] = {
      ...newConversations[conversation.id],
      ...conversation,
      lastMessage: getLatestMessage(newConversations[conversation.id], conversation),
    };
  });

  return conversations;
}

const updateContact = (state: ConversationFilteredState, conversationId: string, displayName: string) => {
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

const removeTagFromConversation = (state: ConversationFilteredState, conversationId: string, tagId: string) => {
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

export default function conversationFilteredReducer(
  state: ConversationFilteredState = {
    items: {},
    paginationData: {previousCursor: null, nextCursor: null, total: null},
    currentFilter: {},
  },
  action: FilterAction | Action
): ConversationFilteredState {
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
      return {items: {}, paginationData: {previousCursor: null, nextCursor: null, total: null}, currentFilter: {}};

    case getType(filterActions.updateFilteredConversationsAction):
      return {
        ...state,
        currentFilter: action.payload.filter,
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

    case getType(actions.removeTagFromConversationAction):
      return removeTagFromConversation(state, action.payload.conversationId, action.payload.tagId);

    case getType(actions.updateConversationContactInfoAction): {
      return updateContact(state, action.payload.conversationId, action.payload.displayName);
    }
    default:
      return state;
  }
}

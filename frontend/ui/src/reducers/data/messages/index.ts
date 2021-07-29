import {ActionType, getType} from 'typesafe-actions';
import * as actions from '../../../actions/messages';
import * as metadataActions from '../../../actions/metadata';
import {Message, MessageMetadata} from 'model';
import {cloneDeep, sortBy} from 'lodash-es';

type Action = ActionType<typeof actions> | ActionType<typeof metadataActions>;

export type Messages = {
  all: {
    [messageId: string]: Message[];
  };
};

const initialState = {
  all: {},
};

function mergeMessages(oldMessages: Message[], newMessages: Message[]): Message[] {
  const messages = cloneDeep(oldMessages);
  newMessages.forEach((message: Message) => {
    if (!messages.some((item: Message) => item.id === message.id)) {
      messages.push(message);
    }
  });
  return sortBy(messages, message => message.sentAt);
}

const findConversationId = (state: Messages, messageId: string) => {
  return Object.keys(state.all).find((conversationId: string) => {
    if (state.all[conversationId].find((message: Message) => message.id === messageId)) {
      return true;
    }
    return false;
  });
};

const setMetadata = (state: Messages, action: ActionType<typeof metadataActions>) => {
  const conversationId = findConversationId(state, action.payload.identifier);

  if (!conversationId) {
    return state;
  }

  return {
    ...state,
    all: {
      ...state.all,
      [conversationId]: state.all[conversationId].map((message: Message) => {
        if (message.id !== action.payload.identifier) {
          return message;
        }
        return {
          ...message,
          metadata: action.payload.metadata as MessageMetadata,
        };
      }),
    },
  };
};

export default function messagesReducer(state = initialState, action: Action): Messages {
  switch (action.type) {
    case getType(actions.loadingMessagesAction):
    case getType(actions.addMessagesAction):
      return {
        ...state,
        all: {
          ...state.all,
          [action.payload.conversationId]: [
            ...mergeMessages(state.all[action.payload.conversationId] || [], [...action.payload.messages]),
          ],
        },
      };

    case getType(metadataActions.setMetadataAction):
      if (action.payload.subject !== 'message') {
        return state;
      }
      return setMetadata(state, action);
    default:
      return state;
  }
}

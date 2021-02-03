import {ActionType, getType} from 'typesafe-actions';
import * as actions from '../../../actions/messages';
import {Message} from 'httpclient';
import {cloneDeep, sortBy} from 'lodash-es';

type Action = ActionType<typeof actions>;

export type Messages = {
  all: {
    [messageId: string]: Message[]
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

export default function messagesReducer(state = initialState, action: Action): Messages {
  switch (action.type) {
    case getType(actions.loadingMessagesAction):
      if (state.all[action.payload.conversationId]) {
        return {
          ...state,
          all: {
            ...state.all,
            [action.payload.conversationId]: [
              ...mergeMessages([...action.payload.messages], []),
              ...state.all[action.payload.conversationId],
            ],
          },
        };
      } else {
        return {
          ...state,
          all: {
            ...state.all,
            [action.payload.conversationId]: [...mergeMessages([...action.payload.messages], [])],
          },
        };
      }

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

    default:
      return state;
  }
}

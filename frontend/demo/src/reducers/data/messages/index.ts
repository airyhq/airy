import {ActionType, getType} from 'typesafe-actions';
import * as actions from '../../../actions/messages';
import {Message} from 'httpclient';
import {DataState} from '..';
import {sortBy} from 'lodash-es';

type Action = ActionType<typeof actions>;

export type MessagesState = {
  data: DataState;
};

export type MessageById = {
  [messageId: string]: Message;
};

export type Messages = {
  all: Message[];
};

const initialState = {
  all: [],
};

function organiseMessages(messages: Message[]): Message[] {
  return sortBy(messages, message => message.sentAt);
}

export default function messagesReducer(state = initialState, action: Action): any {
  switch (action.type) {
    case getType(actions.loadingMessagesAction):
      if (state.all[action.payload.conversationId]) {
        return {
          ...state,
          all: {
            ...state.all,
            [action.payload.conversationId]: [
              ...organiseMessages([...action.payload.messages]),
              ...state.all[action.payload.conversationId],
            ],
          },
        };
      } else {
        return {
          ...state,
          all: {
            ...state.all,
            [action.payload.conversationId]: [...organiseMessages([...action.payload.messages])],
          },
        };
      }

    case getType(actions.sendMessagesAction):
      return {
        ...state,
        all: {
          ...state.all,
          [action.payload.conversationId]: [
            ...organiseMessages(state.all[action.payload.conversationId].concat([action.payload.message])),
          ],
        },
      };

    default:
      return state;
  }
}

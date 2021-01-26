import {ActionType, getType} from 'typesafe-actions';

import * as actions from '../../../actions/messages';
import {Message} from 'httpclient';
import {DataState} from '..';
import _ from 'lodash-es';

type Action = ActionType<typeof actions>;

export type MessagesState = {
  data: DataState;
};

export type MessageById = {
  [messageId: string]: Message;
};

export type Messages = {
  all: {[conversationId: string]: MessageById};
};

const initialState = {
  all: {},
};

function organiseMessagesWithPrevious(messages: Message[], previousMessages: MessageById): MessageById {
  return {...organiseMessages(messages), ...previousMessages};
}

function organiseMessages(messages: Message[]): MessageById {
  return _.keyBy(messages.reverse(), 'id');
}

export default function messagesReducer(state = initialState, action: Action): any {
  switch (action.type) {
    case getType(actions.loadingMessagesAction):
      if (state.all[action.payload.conversationId]) {
        return {
          ...state,
          all: {
            ...state.all,
            [action.payload.conversationId]: organiseMessagesWithPrevious(
              [...action.payload.messages],
              state.all[action.payload.conversationId]
            ),
          },
        };
      } else {
        return {
          ...state,
          all: {
            ...state.all,
            [action.payload.conversationId]: organiseMessages([...action.payload.messages]),
          },
        };
      }

    default:
      return state;
  }
}

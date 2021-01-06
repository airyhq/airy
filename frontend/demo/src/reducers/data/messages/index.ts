import {ActionType, getType} from 'typesafe-actions';

import * as actions from '../../../actions/messages';
import {Message} from '../../../model/Message';
import {DataState} from '..';

type Action = ActionType<typeof actions>;

export type MessagesState = {
  data: DataState;
};

export type MessageMap = {
  [messageId: string]: Message;
};

export type Messages = {
  all: {[conversationId: string]: MessageMap};
};

const initialState = {
  all: {},
};

function organiseMessages(messages: Message[]): MessageMap {
  const newMessages: MessageMap = {};
  messages.forEach((message: Message) => {
    newMessages[message.id] = message;
  });
  return newMessages;
}

export default function messagesReducer(state = initialState, action: Action): any {
  switch (action.type) {
    case getType(actions.loadingMessagesAction):
      return {
        ...state,
        all: {
          ...state.all,
          [action.payload.conversationId]: organiseMessages(action.payload.messages),
        },
      };
    default:
      return state;
  }
}

import { ActionType, getType } from 'typesafe-actions';
import { combineReducers } from 'redux';

import * as actions from '../../../actions/messages';
import { Message } from '../../../model/Message';
import { DataState } from '..';

type Action = ActionType<typeof actions>;

export type MessagesState = {
  data: DataState;
};

export type Messages = {
  items: Message[];
};

const initialState = {
  items: [],
};

export default function messagesReducer(state = initialState, action: Action): any {
  switch (action.type) {
    case getType(actions.loadingMessagesAction):
      return {
        ...state,
        items: action.payload
      };
    default:
      return state;
  }
}
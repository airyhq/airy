import _, {combineReducers, Reducer} from 'redux-starter-kit';
import {User} from '../../model/User';

import user from './user';
import conversations, {ConversationsState} from './conversations';

export type DataState = {
  user: User;
  conversations: ConversationsState;
};

const reducers: Reducer = combineReducers<DataState>({
  user,
  conversations,
});

export default reducers;

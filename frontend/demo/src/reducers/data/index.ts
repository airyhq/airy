import _, {combineReducers, Reducer} from 'redux-starter-kit';
import {User} from '../../model/User';
import {Channel} from '../../model/Channel';

import user from './user';
import conversations, {ConversationsState} from './conversations';
import channels from './channels';

export type DataState = {
  user: User;
  conversations: ConversationsState;
  channels: Channel[];
};

const reducers: Reducer = combineReducers<DataState>({
  user,
  conversations,
  channels,
});

export default reducers;

import _, {combineReducers, Reducer} from 'redux-starter-kit';
import {User} from '../../model/User';
import {Channel} from '../../model/Channel';

import user from './user';
import channels from './channels';

export type DataState = {
  user: User;
  channels: Channel[];
};

const reducers: Reducer = combineReducers<DataState>({
  user,
  channels,
});

export default reducers;

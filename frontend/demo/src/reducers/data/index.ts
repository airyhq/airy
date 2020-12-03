import _, {combineReducers, Reducer} from 'redux-starter-kit';
import {User} from '../../model/User';
import {Tags} from './tags';
import {Settings} from './settings';
import {Channel} from '../../model/Channel';

import user from './user';
import tags from './tags';
import settings from './settings';
import channels from './channels';

export type DataState = {
  user: User;
  tags: Tags;
  settings: Settings;
  channels: Channel[];
};

const reducers: Reducer = combineReducers<DataState>({
  user,
  tags,
  settings,
  channels,
});

export default reducers;

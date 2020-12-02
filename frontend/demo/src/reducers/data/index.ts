import _, {combineReducers, Reducer} from 'redux-starter-kit';
import {User} from '../../model/User';
import {Tags} from './tags';
import {Settings} from './settings';

import user from './user';
import tags from './tags';
import settings from './settings';

export type DataState = {
  user: User;
  tags: Tags;
  settings: Settings;
};

const reducers: Reducer = combineReducers<DataState>({
  user,
  tags,
  settings,
});

export default reducers;

import _, {combineReducers, Reducer} from 'redux-starter-kit';
import {User} from '../../model/User';
import {Tags} from './tags';
import {Settings} from './settings';
import {Channel} from '../../model/Channel';

import user from './user';
import conversations, {ConversationsState} from './conversations';
import tags from './tags';
import settings from './settings';
import channels from './channels';

export * from './channels';
export * from './conversations';
export * from './settings';
export * from './tags';
export {initialState} from './user';

export type DataState = {
  user: User;
  conversations: ConversationsState;
  tags: Tags;
  settings: Settings;
  channels: Channel[];
};

const reducers: Reducer = combineReducers<DataState>({
  user,
  conversations,
  tags,
  settings,
  channels,
});

export default reducers;

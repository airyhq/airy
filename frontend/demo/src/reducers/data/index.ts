import _, {combineReducers, Reducer} from 'redux-starter-kit';
import {User, Channel} from 'httpclient';
import {Tags} from './tags';
import {Settings} from './settings';

import user from './user';
import conversations, {ConversationsState} from './conversations';
import tags from './tags';
import settings from './settings';
import channels from './channels';
import messages, {Messages} from './messages';

export * from './channels';
export * from './conversations';
export * from './settings';
export * from './tags';
export {initialState} from './user';

export type DataState = {
  user: User;
  conversations: ConversationsState;
  messages: Messages;
  tags: Tags;
  settings: Settings;
  channels: Channel[];
};

const reducers: Reducer = combineReducers<DataState>({
  user,
  conversations,
  messages,
  tags,
  settings,
  channels,
});

export default reducers;

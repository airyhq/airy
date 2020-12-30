import _, {combineReducers, Reducer} from 'redux-starter-kit';
import {User} from '../../model/User';
import {Tags} from './tags';
import {Settings} from './settings';
import {Channel} from '../../model/Channel';
import {Message} from '../../model/Message';

import user from './user';
import conversations, {ConversationsState} from './conversations';
import tags from './tags';
import settings, { SettingsState } from './settings';
import channels from './channels';
import messages, { Messages, MessagesState } from './messages';

export type DataState = {
  user: User;
  conversations: ConversationsState;
  // messages: Messages;
  tags: Tags;
  settings: Settings;
  channels: Channel[];
};

const reducers: Reducer = combineReducers<DataState>({
  user,
  conversations,
  // messages,
  tags,
  settings,
  channels,
});

export default reducers;

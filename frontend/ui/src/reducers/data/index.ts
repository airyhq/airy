import {combineReducers, Reducer} from 'redux';
import {User} from 'model';
import {Tags} from './tags';
import {Templates} from './templates';

import user from './user';
import conversations, {ConversationsState} from './conversations';
import tags from './tags';
import config, {Config} from './config';
import channels, {ChannelsState} from './channels';
import messages, {Messages} from './messages';
import templates from './templates';

export * from './channels';
export * from './conversations';
export * from './conversationsFilter';
export * from './config';
export * from './tags';
export * from './templates';
export * from './user';

export type DataState = {
  user: User;
  conversations: ConversationsState;
  messages: Messages;
  tags: Tags;
  channels: ChannelsState;
  config: Config;
  templates: Templates;
};

const reducers: Reducer = combineReducers<DataState>({
  user,
  conversations,
  messages,
  tags,
  channels,
  config,
  templates,
});

export default reducers;

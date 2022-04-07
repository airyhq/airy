import _, {combineReducers, Reducer} from 'redux';
import {User} from 'model';

import user from './user';
import config, {Config} from './config';
import channels, {ChannelsState} from './channels';

export * from './channels';
export * from './config';
export * from './user';

export type DataState = {
  user: User;
  channels: ChannelsState;
  config: Config;
};

const reducers: Reducer = combineReducers<DataState>({
  user,
  channels,
  config,
});

export default reducers;
